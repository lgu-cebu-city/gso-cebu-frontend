import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreItemsViewModel } from 'src/app/data-model/are-items-view-model';
import { RequestForInspectionItemModel } from 'src/app/data-model/request-for-inspection-item-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { AreItemsSelectionDialogComponent } from '../are-items-selection-dialog/are-items-selection-dialog.component';
import { DialogData, RequestForInspectionComponent } from '../request-for-inspection.component';

@Component({
  selector: 'app-rfi-item-detail-dialog',
  templateUrl: './rfi-item-detail-dialog.component.html',
  styleUrls: ['./rfi-item-detail-dialog.component.css']
})
export class RfiItemDetailDialogComponent implements OnInit {
  itemSelected: AreItemsViewModel = new AreItemsViewModel();
  issue: string = "";
  remarks: string = "";
  btnText: string = "Add";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<RequestForInspectionComponent>,
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
      this.issue = this.data.selectedItem.issue;
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
    if (!this.issue) {
      this.notifService.showNotification(NotificationType.error, "Please indicate the issue!");
      return;
    }
    var retItem = new RequestForInspectionItemModel(
      "",
      0,
      this.itemSelected.id,
      this.itemSelected.brand,
      this.itemSelected.areId,
      this.itemSelected.parNo,
      this.issue,
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
