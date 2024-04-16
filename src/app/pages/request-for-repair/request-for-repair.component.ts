import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Department } from 'src/app/data-model/department';
import { RequestForRepairItemModel } from 'src/app/data-model/request-for-repair-item-model';
import { RequestForRepairModel } from 'src/app/data-model/request-for-repair-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { RfrItemDetailDialogComponent } from './rfr-item-detail-dialog/rfr-item-detail-dialog.component';

export interface DialogData {
  selectedData: RequestForRepairModel;
  selectedItem: RequestForRepairItemModel;
  department: string;
  currentItemId: string;
  repairResult: string;
  repairRemarks: string;
}

@Component({
  selector: 'app-request-for-repair',
  templateUrl: './request-for-repair.component.html',
  styleUrls: ['./request-for-repair.component.css']
})
export class RequestForRepairComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  departmentSelection: Department[] = [];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  itemDataSource = new MatTableDataSource<RequestForRepairItemModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemDisplayedColumns: string[] = ['itemNo', 'description', 'areNo', 'natureOfRequest', 'action'];
  rfiId: string = "";
  transNo: string = "";
  transDate: Date = new Date;
  reason: string = "";
  remarks: string = "";
  btnSaveText: string = "Save";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<RequestForRepairComponent>,
    private httpRequest: HttpRequestService
  ) { }

  ngOnInit(): void {
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
        this.httpRequest.getRequestForRepairById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: RequestForRepairModel) {
    this.rfiId = data.id;
    this.transNo = data.transactionNo;
    this.transDate = data.transactionDate;
    this.deptSelected = { value: data.departmentId, text: data.departmentName };
    this.reason = data.reason;
    this.remarks = data.remarks;
    this.itemDataSource.data = data.items;
    this.refreshTable();
    this.btnSaveText = "Update";
  }

  getTransactionNo() {
    this.httpRequest.getRequestForRepairTransactionNo().subscribe((result) => {
      if (result.statusCode == 200) {
        this.transNo = result.data[0].transactionNo;
      }
    });
  }

  loadDepartment() {
    this.httpRequest.getDepartmentAll().subscribe((result) => {
      if (result.statusCode == 200) {
        this.departmentSelection = result.data;
      }
    });
  }

  deptSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  addItem() {
    if (!this.deptSelected.value) {
      this.notifService.showNotification(NotificationType.error, "Please select department!");
      return;
    }
    const dialogRef = this.dialog.open(RfrItemDetailDialogComponent, {
      data: {
        department: this.deptSelected.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.retItem) {
        result.retItem.itemNo = this.itemDataSource.data.length + 1;
        this.itemDataSource.data.push(result.retItem);
        this.refreshTable();
      }
    });
  }

  editItem(index: number) {
    var selectedItemx: RequestForRepairItemModel;
    selectedItemx = this.itemDataSource.data[index];
    const dialogRef = this.dialog.open(RfrItemDetailDialogComponent, {
      data: {
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

    if (this.reason == "") {
      msg = "Please input action taken!";
    }
    if (this.remarks == "") {
      msg = "Please input remarks!";
    }
    if (this.itemDataSource.data.length == 0) {
      msg = "Please add Item!";
    }
    if (this.deptSelected.value == "") {
      msg = "Please select department!";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    var isDataValid = this.isEntryValid();
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }
    var data = new RequestForRepairModel(
      "",
      this.transNo,
      this.transDate,
      this.deptSelected.value,
      this.deptSelected.text,
      this.reason,
      this.remarks,
      this.itemDataSource.data
    )

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveRequestForRepair(data).subscribe((result) => {
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
      this.httpRequest.updateRequestForRepair(this.rfiId, data).subscribe((result) => {
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
    this.rfiId = "";
    this.transNo = "";
    this.transDate = new Date;
    this.reason = "";
    this.remarks = "";
    this.deptSelected = {value: "", text: ""};
    this.itemDataSource = new MatTableDataSource<RequestForRepairItemModel>([]);
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/request-for-repair");
    }
  }

  gotoList() {
    this.router.navigate(["/request-for-repair-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
