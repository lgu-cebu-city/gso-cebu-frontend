import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { PropertyRequisitionItemModel } from 'src/app/data-model/property-requisition-item-model';
import { PropertyRequisitionModel } from 'src/app/data-model/property-requisition-model';
import { AreItemsSelectionDialogComponent } from '../request-for-inspection/are-items-selection-dialog/are-items-selection-dialog.component';
import { AreItemsViewModel } from 'src/app/data-model/are-items-view-model';

export interface DialogData {
  selectedData: PropertyRequisitionModel;
}

@Component({
  selector: 'app-property-requisition-slip',
  templateUrl: './property-requisition-slip.component.html',
  styleUrls: ['./property-requisition-slip.component.css']
})
export class PropertyRequisitionSlipComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  itemDataSource = new MatTableDataSource<PropertyRequisitionItemModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemDisplayedColumns: string[] = ['itemCode', 'uom', 'description', 'action'];
  
  prsId: string = "";
  transNo: string = "";
  transDate: Date = new Date;
  requestorId: string = "";
  requestorName: string = "";
  preparedById: string = "";
  preparedByName: string = "";
  dateFrom: Date = new Date;
  dateTo: Date = new Date;
  purpose: string = "";
  remarks: string = "";
  btnSaveText: string = "Save";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<PropertyRequisitionSlipComponent>,
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
        this.httpRequest.getPropertyRequisitionById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: PropertyRequisitionModel) {
    this.prsId = data.id;
    this.transNo = data.transactionNo;
    this.transDate = data.transactionDate;
    this.requestorId = data.requestorId;
    this.requestorName = data.requestorName;
    this.preparedById = data.preparedById;
    this.preparedByName = data.preparedByName;
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
    this.purpose = data.purpose;
    this.remarks = data.remarks;
    this.itemDataSource.data = data.items;
    this.refreshTable();
    this.btnSaveText = "Update";
  }

  getTransactionNo() {
    this.httpRequest.getPropertyRequisitionTransactionNo().subscribe((result) => {
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
          this.itemDataSource.data.push(new PropertyRequisitionItemModel(
            "",
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

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.requestorName == "") {
      msg = "Please input requestor!";
    }
    if (this.preparedByName == "") {
      msg = "Please input prepared by person!";
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
    var data = new PropertyRequisitionModel(
      "",
      this.transNo,
      this.transDate,
      this.requestorId,
      this.requestorName,
      this.preparedById,
      this.preparedByName,
      this.dateFrom,
      this.dateTo,
      this.purpose,
      this.remarks,
      this.itemDataSource.data
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.savePropertyRequisition(data).subscribe((result) => {
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
      this.httpRequest.updatePropertyRequisition(this.prsId, data).subscribe((result) => {
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
    this.prsId = "";
    this.transNo = "";
    this.transDate = new Date;
    this.requestorId = "";
    this.requestorName = "";
    this.preparedById = "";
    this.preparedByName = "";
    this.dateFrom = new Date;
    this.dateTo = new Date;
    this.purpose = "";
    this.remarks = "";
    this.itemDataSource = new MatTableDataSource<PropertyRequisitionItemModel>([]);
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/property-requisition-slip");
    }
  }

  gotoList() {
    this.router.navigate(["/property-requisition-slip-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
