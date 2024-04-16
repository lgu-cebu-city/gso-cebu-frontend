import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AreItemsViewModel } from 'src/app/data-model/are-items-view-model';
import { PropertyAccountabilityItemModel } from 'src/app/data-model/property-accountability-item-model';
import { PropertyAccountabilityModel } from 'src/app/data-model/property-accountability-model';
import { PropertyRequisitionModel } from 'src/app/data-model/property-requisition-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { AreItemsSelectionDialogComponent } from '../request-for-inspection/are-items-selection-dialog/are-items-selection-dialog.component';
import { PropreqSelectionDialogComponent } from './propreq-selection-dialog/propreq-selection-dialog.component';

export interface DialogData {
  selectedData: PropertyAccountabilityModel;
}

@Component({
  selector: 'app-property-accountability-slip',
  templateUrl: './property-accountability-slip.component.html',
  styleUrls: ['./property-accountability-slip.component.css']
})
export class PropertyAccountabilitySlipComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  itemDataSource = new MatTableDataSource<PropertyAccountabilityItemModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemDisplayedColumns: string[] = ['itemCode', 'uom', 'description', 'action'];
  selectedRequest: PropertyRequisitionModel;
  
  pasId: string = "";
  transNo: string = "";
  transDate: Date = new Date;
  propReqId: string = "";
  requestorId: string = "";
  requestorName: string = "";
  approvedById: string = "";
  approvedByName: string = "";
  dateFrom: Date = new Date;
  dateTo: Date = new Date;
  requestType: string = "";
  purpose: string = "";
  remarks: string = "";
  btnSaveText: string = "Save";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<PropertyAccountabilitySlipComponent>,
    private httpRequest: HttpRequestService
  ) { }

  ngOnInit(): void {
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
        this.httpRequest.getPropertyAccountabilityById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: PropertyAccountabilityModel) {
    this.pasId = data.id;
    this.transNo = data.transactionNo;
    this.transDate = data.transactionDate;
    this.propReqId = data.propReqId;
    this.requestorId = data.requestorId;
    this.requestorName = data.requestorName;
    this.approvedById = data.approvedById;
    this.approvedByName = data.approvedByName;
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
    this.requestType = data.requestType;
    this.purpose = data.purpose;
    this.remarks = data.remarks;
    this.itemDataSource.data = data.items;
    this.refreshTable();
    this.btnSaveText = "Update";
  }

  getTransactionNo() {
    this.httpRequest.getPropertyAccountabilityTransactionNo().subscribe((result) => {
      if (result.statusCode == 200) {
        this.transNo = result.data[0].transactionNo;
      }
    });
  }

  addItem() {
    const dialogRef = this.dialog.open(AreItemsSelectionDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          var res: AreItemsViewModel = result.selectedItem;
          if (this.itemDataSource.data.findIndex(i => i.areId == res.areId && i.itemId == res.brandId) >= 0) {
            this.notifService.showNotification(NotificationType.error, "Item already selected.");
            return;
          }
          this.itemDataSource.data.push(new PropertyAccountabilityItemModel(
            "",
            0,
            res.propertyNo,
            res.brandId,
            res.brand,
            res.uom,
            res.areId,
            res.parNo
          ));
          this.refreshTable();
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item selected.");
        }
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

  selectRequest() {
    const dialogRef = this.dialog.open(PropreqSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedRequest = result.selectedWMR;
        
        this.propReqId = this.selectedRequest.id;
        this.requestorId = this.selectedRequest.requestorId;
        this.requestorName = this.selectedRequest.requestorName;
        this.dateFrom = this.selectedRequest.dateFrom;
        this.dateTo = this.selectedRequest.dateTo;
        this.purpose = this.selectedRequest.purpose;
        this.remarks = this.selectedRequest.remarks;
        this.selectedRequest.items.forEach(item => {
          this.itemDataSource.data.push(new PropertyAccountabilityItemModel(
            "",
            0,
            item.itemCode,
            item.itemId,
            item.description,
            item.uom,
            item.areId,
            item.areNo
          ));
          this.refreshTable();
        })
      }
    });
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.requestorName == "") {
      msg = "Please input requestor!";
    }
    if (this.approvedByName == "") {
      msg = "Please input approved by person!";
    }
    if (this.purpose == "") {
      msg = "Please input purpose!";
    }
    if (this.remarks == "") {
      msg = "Please input remarks!";
    }
    if (this.itemDataSource.data.length == 0) {
      msg = "Please add Item!";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    var isDataValid = this.isEntryValid();
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }
    var data = new PropertyAccountabilityModel(
      "",
      this.transNo,
      this.transDate,
      this.propReqId,
      this.requestorId,
      this.requestorName,
      this.approvedById,
      this.approvedByName,
      this.dateFrom,
      this.dateTo,
      this.requestType,
      this.purpose,
      this.remarks,
      this.itemDataSource.data
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.savePropertyAccountability(data).subscribe((result) => {
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
      this.httpRequest.updatePropertyAccountability(this.pasId, data).subscribe((result) => {
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
    this.pasId = "";
    this.transNo = "";
    this.transDate = new Date;
    this.propReqId = "";
    this.requestorId = "";
    this.requestorName = "";
    this.approvedById = "";
    this.approvedByName = "";
    this.dateFrom = new Date;
    this.dateTo = new Date;
    this.requestType = "";
    this.purpose = "";
    this.remarks = "";
    this.itemDataSource = new MatTableDataSource<PropertyAccountabilityItemModel>([]);
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/property-accountability-slip");
    }
  }

  gotoList() {
    this.router.navigate(["/property-accountability-slip-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
