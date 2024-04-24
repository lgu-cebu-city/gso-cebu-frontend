import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';
import { RequestQuotationItemsModel } from 'src/app/data-model/request-quotation-items-model';
import { RequestQuotationModel } from 'src/app/data-model/requestQuotationModel';
import { Type } from 'src/app/data-model/type';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { PrSelectionDialogComponent } from './pr-selection-dialog/pr-selection-dialog.component';

export interface DialogData {
  selectedData: RequestQuotationModel;
  typeList: Type[];
}

@Component({
  selector: 'app-request-quotation',
  templateUrl: './request-quotation.component.html',
  styleUrls: ['./request-quotation.component.scss']
})
export class RequestQuotationComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  isLoading: boolean = false;
  requestQuotationFormGroup: FormGroup;
  displayedColumns: string[] = ['description', 'quantity', 'unitMeasure', 'cost', 'total'];
  itemDataSource = new MatTableDataSource<RequestQuotationItemsModel>([]);
  selectedPR: PurchaseRequestModel;
  canvasserSelected: { value: string; text: string } = { value: "", text: "" };
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  listEmployee: iEmp[] = [];
  rfqId: string = "";
  approvedBudget: number = 0;
  btnSaveText: string = "Save";

  formControlEmployee = new FormControl('');
  filteredEmployee: Observable<iEmp[]>;

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<RequestQuotationComponent>,
    private httpRequest: HttpRequestService
  ) {
    dialogRefx.disableClose = true;
  }

  async ngOnInit(): Promise<void> {
    this.listEmployee = this.authService.listEmployee;
    this.filteredEmployee = this.formControlEmployee.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployee(value || '')),
    );


    this.initForm();
    await this.getTransactionNo().then((result: boolean) => {
      if (result) {
        this.initParam();
      } else {
        this.notifService.showNotification(NotificationType.error, "Unable to fetch Transaction No. Please reload the page.");
      }
    });
  }

  initParam() {
    if (this.data) {
      this.initData(this.data.selectedData);
    }
    this.route.params.subscribe((param: Params) =>  {
      if (param['id']) {
        var paramId = param['id'];
        this.removeParam();
        this.httpRequest.getRequestQuotationById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: RequestQuotationModel) {
    this.rfqId = data.id;
    this.requestQuotationFormGroup.controls['transactionNo'].setValue(data.transactionNo);
    this.requestQuotationFormGroup.controls['transactionDate'].setValue(data.transactionDate);
    this.requestQuotationFormGroup.controls['recommendingDate'].setValue(data.recommendingDate);
    this.requestQuotationFormGroup.controls['prNo'].setValue(data.prNo);
    this.requestQuotationFormGroup.controls['prDate'].setValue(this.formatDate(data.prDate));
    this.requestQuotationFormGroup.controls['departmentName'].setValue(data.departmentName);
    this.requestQuotationFormGroup.controls['openningDate'].setValue(data.openningDate);
    this.requestQuotationFormGroup.controls['location'].setValue(data.location);
    this.requestQuotationFormGroup.controls['canvasserName'].setValue(data.canvasserName);
    this.requestQuotationFormGroup.controls['procurementMode'].setValue(data.procurementMode);
    this.requestQuotationFormGroup.controls['biddingType'].setValue(data.biddingType);
    this.requestQuotationFormGroup.controls['approvedBudget'].setValue(data.approvedBudget);
    this.requestQuotationFormGroup.controls['bidSecurity'].setValue(data.bidSecurity);
    this.requestQuotationFormGroup.controls['bidDocsFee'].setValue(data.bidDocsFee);
    this.requestQuotationFormGroup.controls['supplyDescription'].setValue(data.supplyDescription);
    this.requestQuotationFormGroup.controls['deliveryPeriod'].setValue(data.deliveryPeriod);
    this.requestQuotationFormGroup.controls['priceValidity'].setValue(data.priceValidity);
    
    this.httpRequest.getPurchaseRequestById(data.prId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.selectedPR = result.data;
      }
    });
    
    data.items.forEach((item) => {
      this.itemDataSource.data.push(item);
      this.refreshTable();
    });
    this.btnSaveText = "Update";
  }

  initForm() {
    var openDate: Date = new Date();
    openDate.setHours(10, 0, 0);
    this.requestQuotationFormGroup = new FormGroup({
      transactionNo: new FormControl(""),
      transactionDate: new FormControl(new Date()),
      recommendingDate: new FormControl(new Date()),
      prNo: new FormControl(""),
      prDate: new FormControl(""),
      departmentName: new FormControl("", [Validators.required]),
      openningDate: new FormControl(openDate),
      location: new FormControl("Cebu City Hall"),
      canvasserName: new FormControl("", [Validators.required]),
      procurementMode: new FormControl("Small Value Procurement", [Validators.required]),
      biddingType: new FormControl("Traditional Bidding", [Validators.required]),
      approvedBudget: new FormControl("", [Validators.required]),
      bidSecurity: new FormControl(""),
      bidDocsFee: new FormControl(""),
      supplyDescription: new FormControl("", [Validators.required]),
      deliveryPeriod: new FormControl(0),
      priceValidity: new FormControl(0),
    });
  }

  async ngAfterViewInit() {
    
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getRequestQuotationTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.requestQuotationFormGroup.controls['transactionNo'].setValue(result.data[0].transactionNo);
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }

  private _filterEmployee(value: string): iEmp[] {
    const filterValue = value.toLowerCase();
    return this.listEmployee.filter(option => option.Fullname.toLowerCase().includes(filterValue));
  }
  employeeSelectionChanged(event: any) {
    this.canvasserSelected = {
      value: event.option.value,
      text: this.listEmployee.find(emp => emp.id == event.option.value).Fullname
    };
  }
  clearEmployeeFilter() {
    this.canvasserSelected = {
      value: "",
      text: ""
    };
  }

  selectPR() {
    const dialogRef = this.dialog.open(PrSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedPR = result.purchaseRequest;
        this.requestQuotationFormGroup.controls['prNo'].setValue(this.selectedPR.prNo);
        this.requestQuotationFormGroup.controls['prDate'].setValue(this.formatDate(this.selectedPR.prDate));
        this.requestQuotationFormGroup.controls['departmentName'].setValue(this.selectedPR.departmentName);
        this.requestQuotationFormGroup.controls['procurementMode'].setValue(this.selectedPR.procurementMode);
        this.requestQuotationFormGroup.controls['supplyDescription'].setValue(this.selectedPR.rationale);
        var _rfqItems: RequestQuotationItemsModel[] = [];
        this.selectedPR.items.forEach((item) => {
          _rfqItems.push(new RequestQuotationItemsModel(
            "",
            item.itemId,
            item.description,
            item.specification,
            item.quantity,
            item.uom,
            item.cost,
            item.total,
            item.remarks,
            item.typeId,
          ));
        });
        this.itemDataSource = new MatTableDataSource<RequestQuotationItemsModel>(_rfqItems);
        this.approvedBudget = 0;
        this.selectedPR.items.forEach(item => {
          this.approvedBudget += item.total;
        });
        this.requestQuotationFormGroup.controls['approvedBudget'].setValue(this.approvedBudget);
      }
    });
  }

  saveData() {
    if (this.approvedBudget > 0 && this.requestQuotationFormGroup.get("approvedBudget")?.value > this.approvedBudget) {
      this.notifService.showNotification(NotificationType.error, "Approved budget must not be greater than the selected PR's approved budget!");
      return;
    }

    if (this.isLoading) return;
    this.isLoading = true;
    var data = new RequestQuotationModel(
      "",
      this.requestQuotationFormGroup.get("transactionNo")?.value || "",
      this.requestQuotationFormGroup.get("transactionDate")?.value,
      this.requestQuotationFormGroup.get("recommendingDate")?.value,
      this.selectedPR.id,
      this.selectedPR.prNo,
      this.selectedPR.prDate,
      this.selectedPR.departmentId.toString(),
      this.selectedPR.departmentName,
      this.requestQuotationFormGroup.get("openningDate")?.value,
      this.requestQuotationFormGroup.get("location")?.value,
      this.canvasserSelected?.value || "",
      this.canvasserSelected?.text || "",
      this.requestQuotationFormGroup.get("procurementMode")?.value || "",
      this.requestQuotationFormGroup.get("biddingType")?.value || "",
      this.requestQuotationFormGroup.get("approvedBudget")?.value,
      this.requestQuotationFormGroup.get("bidSecurity")?.value || 0,
      this.requestQuotationFormGroup.get("bidDocsFee")?.value || 0,
      this.requestQuotationFormGroup.get("supplyDescription")?.value,
      this.requestQuotationFormGroup.get("deliveryPeriod")?.value || 0,
      this.requestQuotationFormGroup.get("priceValidity")?.value || 0,
      this.itemDataSource.data
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveRequestQuotation(data).subscribe((result) => {
        if (result.statusCode == 201) {
          this.notifService.showNotification(NotificationType.success, "Successfully saved!");
          if (this.envFirstLoad == "List") {
            this.saveUpdateSuccess();
          } else {
            this.clearFields();
          }
        } else {
          this.notifService.showNotification(NotificationType.error, "Saving Data Failed!");
        }
      });
    } else if (this.btnSaveText == "Update") {
      this.httpRequest.updateRequestQuotation(this.rfqId, data).subscribe((result) => {
        if (result.statusCode == 200) {
          this.notifService.showNotification(NotificationType.success, "Successfully updated!");
          if (this.envFirstLoad == "List") {
            this.saveUpdateSuccess();
          } else {
            this.clearFields();
          }
        } else {
          this.notifService.showNotification(NotificationType.error, "Updating Data Failed!");
        }
      });
    }
  }
  
  saveUpdateSuccess() {
    var result = true;
    this.dialogRefx.close(result);
  }
  
  clearFields() {
    this.requestQuotationFormGroup.reset();
    Object.keys(this.requestQuotationFormGroup.controls).forEach(key => {
      this.requestQuotationFormGroup.get(key)?.setErrors(null) ;
    });
    this.itemDataSource = new MatTableDataSource<RequestQuotationItemsModel>([]);
    this.requestQuotationFormGroup.controls['transactionDate'].setValue(new Date());
    this.requestQuotationFormGroup.controls['recommendingDate'].setValue(new Date());
    this.requestQuotationFormGroup.controls['openningDate'].setValue(new Date());
    this.requestQuotationFormGroup.controls['approvedBudget'].setValue(0);
    this.requestQuotationFormGroup.controls['bidSecurity'].setValue(0);
    this.requestQuotationFormGroup.controls['bidDocsFee'].setValue(0);
    this.requestQuotationFormGroup.controls['deliveryPeriod'].setValue(0);
    this.requestQuotationFormGroup.controls['priceValidity'].setValue(0);
    this.rfqId = "";
    this.btnSaveText = "Save";
    this.isLoading = false;
    this.getTransactionNo();
    this.removeParam();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/request-quotation");
    }
  }

  gotoList() {
    this.router.navigate(["/request-quotation-list"]);
  }

  canvasserSelectedValue(event: MatSelectChange) {
    this.canvasserSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'M/d/yyy') || "";
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
