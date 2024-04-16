import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PropertyAccountabilityModel } from 'src/app/data-model/property-accountability-model';
import { PropertyReturnItemModel } from 'src/app/data-model/property-return-item-model';
import { PropertyReturnModel } from 'src/app/data-model/property-return-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { PropaccSelectionDialogComponent } from './propacc-selection-dialog/propacc-selection-dialog.component';

export interface DialogData {
  selectedData: PropertyReturnModel;
}

@Component({
  selector: 'app-property-return-slip',
  templateUrl: './property-return-slip.component.html',
  styleUrls: ['./property-return-slip.component.css']
})
export class PropertyReturnSlipComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  itemDataSource = new MatTableDataSource<PropertyReturnItemModel>([]);
  itemReturnDataSource = new MatTableDataSource<PropertyReturnItemModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemDisplayedColumns: string[] = ['itemCode', 'description'];
  selectedPropAcc: PropertyAccountabilityModel;
  selectedItem: PropertyReturnItemModel = null;
  selectedReturnItem: PropertyReturnItemModel = null;
  
  prsId: string = "";
  transNo: string = "";
  transDate: Date = new Date;
  propAccId: string = "";
  requestorId: string = "";
  requestorName: string = "";
  receivedById: string = "";
  receivedByName: string = "";
  processedById: string = "";
  processedByName: string = "";
  returnStatus: string = "Good";
  remarks: string = "";
  btnSaveText: string = "Save";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<PropertyReturnSlipComponent>,
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
        this.httpRequest.getPropertyReturnById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: PropertyReturnModel) {
    this.prsId = data.id;
    this.transNo = data.transactionNo;
    this.transDate = data.transactionDate;
    this.propAccId = data.propAccId;
    this.requestorId = data.requestorId;
    this.requestorName = data.requestorName;
    this.receivedById = data.receivedById;
    this.receivedByName = data.receivedByName;
    this.processedById = data.processedById;
    this.processedByName = data.processedByName;
    this.returnStatus = data.returnStatus;
    this.remarks = data.remarks;
    this.refreshTable();

    this.httpRequest.getPropertyAccountabilityById(data.propAccId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.selectedPropAcc = result.data;
        this.itemDataSource.data = this.selectedPropAcc.items;
        this.propAccId = this.selectedPropAcc.id;
        this.refreshTable();
      }
    });
    this.itemReturnDataSource.data = data.items;

    this.btnSaveText = "Update";
  }

  getTransactionNo() {
    this.httpRequest.getPropertyReturnTransactionNo().subscribe((result) => {
      if (result.statusCode == 200) {
        this.transNo = result.data[0].transactionNo;
      }
    });
  }

  rowSelected(row: PropertyReturnItemModel) {
    this.selectedItem = row;
  }

  returnRowSelected(row: PropertyReturnItemModel) {
    this.selectedReturnItem = row;
  }

  itemIsReturned(row: PropertyReturnItemModel) {
    return this.itemReturnDataSource.data.findIndex(i => i.areId == row.areId && i.itemId == row.itemId) >= 0
  }
 
  addItem() {
    if (!this.selectedItem) {
      this.notifService.showNotification(NotificationType.error, "Please select item!");
      return;
    }
    this.itemReturnDataSource.data.push(this.selectedItem);
    this.refreshTable();
    this.selectedReturnItem = this.itemReturnDataSource.data[this.itemReturnDataSource.data.length - 1];
    this.selectedItem = null;
  }

  removeItem() {
    if (!this.selectedReturnItem) {
      this.notifService.showNotification(NotificationType.error, "Please select item!");
      return;
    }
    var retindx = this.itemReturnDataSource.data.findIndex(i => i == this.selectedReturnItem);
    var indx = this.itemDataSource.data.findIndex(i => i == this.selectedReturnItem);
    this.itemReturnDataSource.data.splice(retindx, 1);
    this.refreshTable();
    this.selectedItem = this.itemDataSource.data[indx];
    this.selectedReturnItem == null;
  }

  addAllItem() {
    this.itemDataSource.data.forEach(i => {
      if (!this.itemReturnDataSource.data.find(item => item == i)) {
        this.itemReturnDataSource.data.push(i);
      }
    })
    this.refreshTable();
    this.selectedReturnItem = this.itemReturnDataSource.data[this.itemReturnDataSource.data.length - 1];
  }

  removeAllItem() {
    this.itemReturnDataSource.data = [];
    this.refreshTable();
  }

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
    cloned = this.itemReturnDataSource.data.slice();
    this.itemReturnDataSource.data = cloned;
  }

  selectAccountability() {
    const dialogRef = this.dialog.open(PropaccSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedPropAcc = result.selectedPAS;
        this.itemDataSource.data = this.selectedPropAcc.items;
        this.propAccId = this.selectedPropAcc.id;
        this.refreshTable();
      }
    });
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.requestorName == "") {
      msg = "Please input requestor!";
    }
    if (this.receivedByName == "") {
      msg = "Please input received by person!";
    }
    if (this.processedByName == "") {
      msg = "Please input processed by person!";
    }
    if (this.remarks == "") {
      msg = "Please input remarks!";
    }
    if (this.itemReturnDataSource.data.length == 0) {
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
    var data = new PropertyReturnModel(
      this.prsId,
      this.transNo,
      this.transDate,
      this.propAccId,
      this.requestorId,
      this.requestorName,
      this.receivedById,
      this.receivedByName,
      this.processedById,
      this.processedByName,
      this.returnStatus,
      this.remarks,
      this.itemReturnDataSource.data
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.savePropertyReturn(data).subscribe((result) => {
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
      this.httpRequest.updatePropertyReturn(this.prsId, data).subscribe((result) => {
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
    this.propAccId = "";
    this.requestorId = "";
    this.requestorName = "";
    this.receivedById = "";
    this.receivedByName = "";
    this.processedById = "";
    this.processedByName = "";
    this.returnStatus = "Good";
    this.remarks = "";
    this.itemDataSource = new MatTableDataSource<PropertyReturnItemModel>([]);
    this.itemReturnDataSource = new MatTableDataSource<PropertyReturnItemModel>([]);
    this.selectedItem = null;
    this.selectedReturnItem = null;
    this.selectedPropAcc = null;
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/property-return-slip");
    }
  }

  gotoList() {
    this.router.navigate(["/property-return-slip-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
