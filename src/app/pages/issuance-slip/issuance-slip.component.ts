import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Department } from 'src/app/data-model/department';
import { InventoryMedicineModel } from 'src/app/data-model/inventory-medicine-model';
import { RequisitionAndIssuanceItemBatchModel } from 'src/app/data-model/requisition-and-issuance-item-batch-model';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';
import { RequisitionAndIssuanceModel } from 'src/app/data-model/requisition-and-issuance-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { RisItemDetailsDialogComponent } from '../requisition-slip/ris-item-details-dialog/ris-item-details-dialog.component';
import { InventoryItemSelectionComponent } from './inventory-item-selection/inventory-item-selection.component';
import { IssuanceSelectionDialogComponent } from './issuance-selection-dialog/issuance-selection-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  selectedData: RequisitionAndIssuanceModel;
  selectedItemData: RequisitionAndIssuanceItemModel;
}

@Component({
  selector: 'app-issuance-slip',
  templateUrl: './issuance-slip.component.html',
  styleUrls: ['./issuance-slip.component.css']
})
export class IssuanceSlipComponent implements OnInit {
  issuanceSlipFormGroup: FormGroup;
  isLoading: boolean = false;
  envFirstLoad = environment.firstLoad;
  departmentSelection: Department[] = [];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  issuanceType: string = "";
  selectedIssuance: RequisitionAndIssuanceModel = null;
  itemDataSource = new MatTableDataSource<RequisitionAndIssuanceItemModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemDisplayedColumnsWithAction: string[] = ['itemCode', 'unit', 'description', 'requestedQty', 'issuedQty', 'remarks', 'action'];
  displayedDetailItemColumns: string[] = ['batchNo', 'expirationDate', 'quantity'];
  datepipe: DatePipe = new DatePipe('en-US');
  risId: string = "";
  btnSaveText: string = "Save";

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<IssuanceSlipComponent>,
    private httpRequest: HttpRequestService
  ) {
    dialogRefx.disableClose = true;
  }

  async ngOnInit(): Promise<void> {
    this.loadDepartment();
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
        this.httpRequest.getRequisitionAndIssuanceById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: RequisitionAndIssuanceModel) {
    this.selectedIssuance = data;
    this.risId = data.id;
    this.issuanceSlipFormGroup.controls['transactionNo'].setValue(data.transactionNo);
    this.issuanceSlipFormGroup.controls['transactionDate'].setValue(data.transactionDate);
    this.issuanceSlipFormGroup.controls['issuanceType'].setValue(data.issuanceType);
    this.issuanceSlipFormGroup.controls['purpose'].setValue(data.purpose);
    this.deptSelected.value = data.departmentId.toString();
    this.deptSelected.text = data.departmentName;
    data.items.forEach((item) => {
      this.itemDataSource.data.push(item);
      this.refreshTable();
    });
    this.btnSaveText = "Update";
  }

  initForm() {
    this.issuanceSlipFormGroup = new FormGroup({
      transactionNo: new FormControl("", [Validators.required]),
      transactionDate: new FormControl(new Date, [Validators.required]),
      issuanceType: new FormControl("Expense Withdrawal", [Validators.required]),
      purpose: new FormControl("", [Validators.required]),
    })
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getRequestIssuanceSlipTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.issuanceSlipFormGroup.controls['transactionNo'].setValue(result.data[0].transactionNo);
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }

  loadDepartment() {
    this.departmentSelection = this.authService.listDepartment;

    var deptx: Department = this.departmentSelection.find(d => d.id == this.authService.getTypeId());
    this.deptSelected = {value: deptx.id, text: deptx.name};
  }

  deptSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  issuanceTypeSelectedValue(event: MatSelectChange) {
    this.issuanceType = event.value;
  }
  
  selectIssuance() {
    const dialogRef = this.dialog.open(IssuanceSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedIssuance = result.selectedIssuance;
        this.issuanceSlipFormGroup.controls['transactionNo'].setValue(this.selectedIssuance.transactionNo);
        this.issuanceSlipFormGroup.controls['transactionDate'].setValue(this.selectedIssuance.transactionDate);
        this.issuanceSlipFormGroup.controls['purpose'].setValue(this.selectedIssuance.purpose);
        this.deptSelected = {
          value: this.selectedIssuance.departmentId,
          text: this.selectedIssuance.departmentName
        }
        this.itemDataSource.data = this.selectedIssuance.items;
        this.refreshTable();
      }
    });
  }

  addItem() {
    if (this.issuanceSlipFormGroup.get("issuanceType")?.value) {
      const dialogRef = this.dialog.open(RisItemDetailsDialogComponent, {
        data: {
          transType: this.issuanceSlipFormGroup.get("issuanceType")?.value,
        },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.itemDataSource.data.push(result.retItem);
          this.refreshTable();
        }
      });
    } else {
      this.notifService.showNotification(NotificationType.error, "Please select Issuance Type!");
    }
  }

  editItem(index: number) {
    var selectedItemx: RequisitionAndIssuanceItemModel;
    selectedItemx = this.itemDataSource.data[index];
    const dialogRef = this.dialog.open(RisItemDetailsDialogComponent, {
      data: {
        transType: this.issuanceSlipFormGroup.get("issuanceType")?.value,
        selectedItem: selectedItemx,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemDataSource.data.splice(index, 1, result.retItem);
        this.refreshTable();
      }
    });
  }

  issuedQuantityChanged(qty: any, data: RequisitionAndIssuanceItemModel) {
    if (+qty.target.value > +data.requestedQty) {
      this.notifService.showNotification(NotificationType.error, "Issued Quantity must not be greater than Requested Quantity.");
      data.issuedQty = +data.requestedQty;
    }
  }

  removeItem(index: number) {
    this.itemDataSource.data.splice(index, 1);
    this.refreshTable();
  }

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
  }

  addBatchItems(item: RequisitionAndIssuanceItemModel) {
    const dialogRef = this.dialog.open(InventoryItemSelectionComponent, {
      data: {
        selectedItemData: item,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result?.selectedItemData) {
        item = result.selectedItemData;
        this.refreshTable();
      }
    });
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (!this.issuanceSlipFormGroup.get("issuanceType")?.value) {
      msg = "Please select Issuance Type";
    }
    if (!this.issuanceSlipFormGroup.get("transactionNo")?.value) {
      msg = "Please input Transaction No.";
    }
    if (!this.deptSelected.value) {
      msg = "Please select Department.";
    }

    return {result: msg == "", message: msg};
  }

  preSaveConfirmation() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirm",
        message: "Are you sure do you want to save this transaction?",
        btnOkText: "Yes",
        btnCancelText: "No",
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveData();
      }
    });
  }

  saveData() {
    if (this.isLoading) return;
    this.isLoading = true;
    var isDataValid = this.isEntryValid();
    
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      this.isLoading = false;
      return;
    }
    // var hasNoData: boolean = false;
    // var iName: string = "";

    // this.selectedIssuance.items.forEach((item: RequisitionAndIssuanceItemModel) => {
    //   if (!item.itemsDetails?.length) {
    //     hasNoData = true;
    //     iName = item.description;
    //   }
    // });

    // if (hasNoData) {
    //   this.notifService.showNotification(NotificationType.error, "Please add batch item/s for "+ iName +"!");
    //   return;
    // }

    var issuanceType = this.issuanceSlipFormGroup.get("issuanceType")?.value;
    var transactionStatus = issuanceType == "Expense Withdrawal" ? "Issued": "For Transfer";
    if (this.selectedIssuance) {
      this.selectedIssuance.issuanceType = issuanceType,
      this.selectedIssuance.transactionStatus = transactionStatus;
      this.selectedIssuance.purpose = this.issuanceSlipFormGroup.get("purpose")?.value;
      this.selectedIssuance.departmentId = this.deptSelected.value;
      this.selectedIssuance.departmentName = this.deptSelected.text;

      this.httpRequest.updateIssuance(this.selectedIssuance.id, this.selectedIssuance).subscribe((result) => {
        if (result.statusCode == 200) {
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
    } else {
      var data = new RequisitionAndIssuanceModel(
        "",
        this.issuanceSlipFormGroup.get("transactionNo")?.value,
        this.issuanceSlipFormGroup.get("transactionDate")?.value,
        "",
        new Date(),
        "",
        this.deptSelected.value,
        this.deptSelected.text,
        this.issuanceSlipFormGroup.get("purpose")?.value || "",
        issuanceType,
        this.selectedIssuance ? "Requested Issuance" : "Direct Issuance",
        transactionStatus,
        this.authService.getTypeId(),
        this.authService.getUserId(),
        this.itemDataSource.data
      );
    
      this.httpRequest.saveRequisition(data).subscribe((result) => {
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
    }
  }
  
  saveUpdateSuccess() {
    var result = true;
    this.dialogRefx.close(result);
  }
  
  clearFields() {
    this.issuanceSlipFormGroup.reset();
    this.selectedIssuance = null;
    // this.issuanceType = ""; Default Transfer Withdrawal
    Object.keys(this.issuanceSlipFormGroup.controls).forEach(key => {
      this.issuanceSlipFormGroup.get(key)?.setErrors(null) ;
    });
    this.itemDataSource = new MatTableDataSource<RequisitionAndIssuanceItemModel>([]);
    this.issuanceSlipFormGroup.controls['transactionDate'].setValue(new Date);
    this.issuanceSlipFormGroup.controls['issuanceType'].setValue("Transfer Withdrawal");
    this.deptSelected = {value: "", text: ""};
    this.risId = "";
    this.btnSaveText = "Save";
    this.isLoading = false;
    this.removeParam();
    this.getTransactionNo();
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/issuance-slip");
    }
  }

  gotoList() {
    this.router.navigate(["/issuance-slip-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
