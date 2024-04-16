import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreIcsItemsViewModel } from 'src/app/data-model/are-ics-items-view-model';
import { WasteMaterialReportItemModel } from 'src/app/data-model/waste-material-report-item-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { DialogData, WasteMaterialReportComponent } from '../waste-material-report.component';
import { WmrItemSelectionDialogComponent } from '../wmr-item-selection-dialog/wmr-item-selection-dialog.component';

@Component({
  selector: 'app-wmr-item-detail-dialog',
  templateUrl: './wmr-item-detail-dialog.component.html',
  styleUrls: ['./wmr-item-detail-dialog.component.css']
})
export class WmrItemDetailDialogComponent implements OnInit {
  itemSelected: AreIcsItemsViewModel = new AreIcsItemsViewModel();
  orNo: string = "";
  orDate: Date = new Date();
  btnText: string = "Add";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<WasteMaterialReportComponent>,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initItemForm();
  }

  initItemForm() {
    if (this.data != undefined && this.data.selectedItem != undefined) {
      this.httpRequest.getWmrPostRepairById(this.data.selectedItem.refId, this.data.selectedItem.refType, this.data.selectedItem.itemId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.itemSelected = result.data;
        }
      });
      this.orNo = this.data.selectedItem.orNo;
      this.btnText = "Update";
    }
  }

  showListItem() {
    const dialogRef = this.dialog.open(WmrItemSelectionDialogComponent, {
      data: {
        department: this.data.department
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          this.itemSelected = result.selectedItem;
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item selected.");
        }
      }
    });
  }

  addItem() {
    if (!this.itemSelected.transactionId) {
      this.notifService.showNotification(NotificationType.error, "Please select Item!");
      return;
    }
    if (!this.orNo) {
      this.notifService.showNotification(NotificationType.error, "Please input OR No!");
      return;
    }
    var retItem = new WasteMaterialReportItemModel(
      "",
      this.itemSelected.propertyNo,
      1,
      this.itemSelected.brandId,
      this.itemSelected.brand,
      this.itemSelected.uom,
      this.itemSelected.transactionId,
      this.itemSelected.transactionNo,
      this.itemSelected.type,
      this.orNo,
      this.orDate,
      this.itemSelected.price,
      new Date()
    );

    this.dialogRef.close(
      {
        retItem
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
