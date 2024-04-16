import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreItemsViewModel } from 'src/app/data-model/are-items-view-model';
import { RequestForRepairItemModel } from 'src/app/data-model/request-for-repair-item-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { AreItemsSelectionDialogComponent } from '../../request-for-inspection/are-items-selection-dialog/are-items-selection-dialog.component';
import { DialogData, RequestForRepairComponent } from '../request-for-repair.component';

@Component({
  selector: 'app-rfr-item-detail-dialog',
  templateUrl: './rfr-item-detail-dialog.component.html',
  styleUrls: ['./rfr-item-detail-dialog.component.css']
})
export class RfrItemDetailDialogComponent implements OnInit {
  itemSelected: AreItemsViewModel = new AreItemsViewModel();
  natureOfRequest: string = "";
  others: string = "";
  remarks: string = "";
  btnText: string = "Add";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<RequestForRepairComponent>,
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
      this.httpRequest.getAllAcknowledgmentReceiptOfEquipmentItemsById(this.data.selectedItem.areId, this.data.selectedItem.itemId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.itemSelected = result.data;
        }
      });

      this.natureOfRequest = this.data.selectedItem.natureOfRequest.split(" | ")[0];
      this.others = this.data.selectedItem.natureOfRequest.split(" | ")[1];
      this.remarks = this.data.selectedItem.remarks;
      this.btnText = "Update";
    }
  }

  showListItem() {
    const dialogRef = this.dialog.open(AreItemsSelectionDialogComponent, {
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
    if (!this.itemSelected.areId) {
      this.notifService.showNotification(NotificationType.error, "Please select Item!");
      return;
    }
    if (!this.natureOfRequest) {
      this.notifService.showNotification(NotificationType.error, "Please indicate the nature of request!");
      return;
    }
    if (this.natureOfRequest == 'Others') {
      if (!this.others) {
        this.notifService.showNotification(NotificationType.error, "Please specify the nature of request!");
        return;
      } else {
        this.natureOfRequest = this.natureOfRequest + " | " + this.others;
      }
    }
    var retItem = new RequestForRepairItemModel(
      "",
      0,
      this.itemSelected.id,
      this.itemSelected.brand,
      this.itemSelected.areId,
      this.itemSelected.parNo,
      this.natureOfRequest,
      this.remarks
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
