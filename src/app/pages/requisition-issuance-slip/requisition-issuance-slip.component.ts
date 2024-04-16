import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Department } from 'src/app/data-model/department';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';
import { RequisitionAndIssuanceModel } from 'src/app/data-model/requisition-and-issuance-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { RisItemDetailsDialogComponent } from '../requisition-slip/ris-item-details-dialog/ris-item-details-dialog.component';

export interface DialogData {
  selectedData: RequisitionAndIssuanceModel;
  itemCategory: string;
  transType: string;
  selectedItem: RequisitionAndIssuanceItemModel;
  itemType: string;
}

@Component({
  selector: 'app-requisition-issuance-slip',
  templateUrl: './requisition-issuance-slip.component.html',
  styleUrls: ['./requisition-issuance-slip.component.css']
})
export class RequisitionIssuanceSlipComponent implements OnInit {
  requisitionSlipFormGroup: FormGroup;
  envFirstLoad = environment.firstLoad;
  departmentSelection: Department[] = [];
  divisionSelection: Department[] = [];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  divisionSelected: { value: string; text: string } = {value: "", text: ""};
  itemDataSource = new MatTableDataSource<RequisitionAndIssuanceItemModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemDisplayedColumns: string[] = ['itemCode', 'unit', 'description', 'requestedQty', 'remarks', 'action'];
  risId: string = "";
  btnSaveText: string = "Save";

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<RequisitionIssuanceSlipComponent>,
    private httpRequest: HttpRequestService
  ) { }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.loadDepartment();
    this.getTransactionNo();
    this.initParam();
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
    this.risId = data.id;
    this.requisitionSlipFormGroup.controls['transactionNo'].setValue(data.transactionNo);
    this.requisitionSlipFormGroup.controls['transactionDate'].setValue(data.transactionDate);
    this.requisitionSlipFormGroup.controls['purpose'].setValue(data.purpose);
    this.requisitionSlipFormGroup.controls['saiNo'].setValue(data.saiNo);
    this.requisitionSlipFormGroup.controls['saiDate'].setValue(data.saiDate);
    this.deptSelected.value = data.departmentId.toString();
    this.deptSelected.text = data.departmentName;
    // this.divisionSelected.value = this.divisionSelection.find(d => d.name == data.division).id;
    // this.divisionSelected.text = data.division.toString();
    data.items.forEach((item) => {
      this.itemDataSource.data.push(item);
      this.refreshTable();
    });
    this.btnSaveText = "Update";
  }

  initForm() {
    this.requisitionSlipFormGroup = new FormGroup({
      transactionNo: new FormControl("", [Validators.required]),
      transactionDate: new FormControl(new Date, [Validators.required]),
      purpose: new FormControl("", [Validators.required]),
      saiNo: new FormControl("", [Validators.required]),
      saiDate: new FormControl(new Date, [Validators.required]),
    })
  }

  getTransactionNo() {
    this.httpRequest.getRequestIssuanceSlipTransactionNo().subscribe((result) => {
      if (result.statusCode == 200) {
        this.requisitionSlipFormGroup.controls['transactionNo'].setValue(result.data[0].transactionNo);
      }
    });
  }

  loadDepartment() {
    this.departmentSelection = this.authService.listDepartment;
  }

  deptSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  divisionSelectedValue(event: MatSelectChange) {
    this.divisionSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  addItem() {
    const dialogRef = this.dialog.open(RisItemDetailsDialogComponent, {
      data: {
        transType: "Request",
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemDataSource.data.push(result.retItem);
        this.refreshTable();
      }
    });
  }

  editItem(index: number) {
    var selectedItemx: RequisitionAndIssuanceItemModel;
    selectedItemx = this.itemDataSource.data[index];
    const dialogRef = this.dialog.open(RisItemDetailsDialogComponent, {
      data: {
        transType: "Request",
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

  removeItem(index: number) {
    this.itemDataSource.data.splice(index, 1);
    this.refreshTable();
  }

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.deptSelected.value == "") {
      msg = "Please select Department.";
    }
    if (this.itemDataSource.data.length == 0) {
      msg = "Please add item/s.";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    var isDataValid = this.isEntryValid();
    
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }
    var data = new RequisitionAndIssuanceModel(
      this.risId,
      this.requisitionSlipFormGroup.get("transactionNo")?.value,
      this.requisitionSlipFormGroup.get("transactionDate")?.value,
      this.requisitionSlipFormGroup.get("saiNo")?.value,
      this.requisitionSlipFormGroup.get("saiDate")?.value,
      this.divisionSelected.text,
      this.deptSelected.value,
      this.deptSelected.text,
      this.requisitionSlipFormGroup.get("purpose")?.value,
      "Transfer Withdrawal",
      "Direct Issuance",
      "For Transfer",
      this.authService.getTypeId(),
      this.authService.getUserId(),
      this.itemDataSource.data
    );

    if (this.btnSaveText == "Save") {
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
    } else if (this.btnSaveText == "Update") {
      this.httpRequest.updateRequisition(this.risId, data).subscribe((result) => {
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
    this.requisitionSlipFormGroup.reset();
    Object.keys(this.requisitionSlipFormGroup.controls).forEach(key => {
      this.requisitionSlipFormGroup.get(key)?.setErrors(null) ;
    });
    this.requisitionSlipFormGroup.controls['transactionDate'].setValue(new Date);
    this.requisitionSlipFormGroup.controls['saiDate'].setValue(new Date);
    this.deptSelected = {value: "", text: ""};
    this.divisionSelected = {value: "", text: ""};
    this.itemDataSource = new MatTableDataSource<RequisitionAndIssuanceItemModel>([]);
    this.risId = "";
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/requisition-issuance-slip");
    }
  }

  gotoList() {
    this.router.navigate(["/requisition-issuance-slip-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
