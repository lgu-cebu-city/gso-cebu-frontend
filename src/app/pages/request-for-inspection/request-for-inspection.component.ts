import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Department } from 'src/app/data-model/department';
import { RequestForInspectionItemModel } from 'src/app/data-model/request-for-inspection-item-model';
import { RequestForInspectionModel } from 'src/app/data-model/request-for-inspection-model';
import { RequestForInspectionTypeModel } from 'src/app/data-model/request-for-inspection-type-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { RfiInspectionTypeSelectionDialogComponent } from './rfi-inspection-type-selection-dialog/rfi-inspection-type-selection-dialog.component';
import { RfiItemDetailDialogComponent } from './rfi-item-detail-dialog/rfi-item-detail-dialog.component';

export interface DialogData {
  selectedData: RequestForInspectionModel;
  selectedItem: RequestForInspectionItemModel;
  selectedType: RequestForInspectionTypeModel[];
  department: string;
  currentItemId: string;
  inspectionResult: string;
  inspectionRemarks: string;
}

@Component({
  selector: 'app-request-for-inspection',
  templateUrl: './request-for-inspection.component.html',
  styleUrls: ['./request-for-inspection.component.css']
})
export class RequestForInspectionComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  departmentSelection: Department[] = [];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  itemDataSource = new MatTableDataSource<RequestForInspectionItemModel>([]);
  typeDataSource = new MatTableDataSource<RequestForInspectionTypeModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemDisplayedColumns: string[] = ['itemNo', 'description', 'areNo', 'issue', 'action'];
  typeDisplayedColumns: string[] = ['type', 'typeAction'];
  rfiId: string = "";
  transNo: string = "";
  transDate: Date = new Date;
  transType: string = "";
  remarks: string = "";
  actionTaken: string = "";
  btnSaveText: string = "Save";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<RequestForInspectionComponent>,
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
        this.httpRequest.getRequestForInspectionById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: RequestForInspectionModel) {
    this.rfiId = data.id;
    this.transNo = data.transactionNo;
    this.transDate = data.transactionDate;
    this.deptSelected = { value: data.departmentId, text: data.departmentName };
    this.transType = data.transactionType;
    this.remarks = data.remarks;
    this.actionTaken = data.actionTaken;
    this.itemDataSource.data = data.items;
    this.refreshTable();
    this.typeDataSource.data = data.type;
    this.refreshTypeTable();
    this.btnSaveText = "Update";
  }

  getTransactionNo() {
    this.httpRequest.getRequestForInspectionTransactionNo().subscribe((result) => {
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
    const dialogRef = this.dialog.open(RfiItemDetailDialogComponent, {
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
    var selectedItemx: RequestForInspectionItemModel;
    selectedItemx = this.itemDataSource.data[index];
    const dialogRef = this.dialog.open(RfiItemDetailDialogComponent, {
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

  addInspectionType() {
    const dialogRef = this.dialog.open(RfiInspectionTypeSelectionDialogComponent, {
      data: {
        selectedType: this.typeDataSource.data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.retType) {
        this.typeDataSource.data = result.retType;
        this.refreshTypeTable();
      }
    });
  }

  removeInspectionType(index: number) {
    this.typeDataSource.data.splice(index, 1);
    this.refreshTypeTable();
  }

  refreshTypeTable() {
    let cloned = this.typeDataSource.data.slice();
    this.typeDataSource.data = cloned;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.actionTaken == "") {
      msg = "Please input action taken!";
    }
    if (this.remarks == "") {
      msg = "Please input remarks!";
    }
    if (this.typeDataSource.data.length == 0) {
      msg = "Please add inspection type!";
    }
    if (this.itemDataSource.data.length == 0) {
      msg = "Please add Item!";
    }
    if (this.deptSelected.value == "") {
      msg = "Please select department!";
    }
    if (this.transType == "") {
      msg = "Please select type!";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    var isDataValid = this.isEntryValid();
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }
    var data = new RequestForInspectionModel(
      "",
      this.transNo,
      this.transDate,
      this.deptSelected.value,
      this.deptSelected.text,
      this.transType,
      this.remarks,
      this.actionTaken,
      this.itemDataSource.data,
      this.typeDataSource.data
    )

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveRequestForInspection(data).subscribe((result) => {
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
      this.httpRequest.updateRequestForInspection(this.rfiId, data).subscribe((result) => {
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
    this.transType = "";
    this.remarks = "";
    this.actionTaken = "";
    this.deptSelected = {value: "", text: ""};
    this.itemDataSource = new MatTableDataSource<RequestForInspectionItemModel>([]);
    this.typeDataSource = new MatTableDataSource<RequestForInspectionTypeModel>([]);
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/request-for-inspection");
    }
  }

  gotoList() {
    this.router.navigate(["/request-for-inspection-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
