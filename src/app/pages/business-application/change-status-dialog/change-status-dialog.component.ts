import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { BusinessApplicationModel } from 'src/app/data-model/business-application-model';
import { DialogData } from '../business-application.component';
import { MatSelectChange } from '@angular/material/select';
import { NotificationType } from 'src/app/util/notification_type';
import { HttpRequestService } from 'src/app/services/http-request.service';

@Component({
  selector: 'app-change-status-dialog',
  templateUrl: './change-status-dialog.component.html',
  styleUrls: ['./change-status-dialog.component.css']
})
export class ChangeStatusDialogComponent implements OnInit {
  listStatus: String[] = [
    "Waiting List",
    "Pending Application",
    "For Verification",
    "For Endorsement",
    "For Assessment",
    "For Payment",
    "Paid",
    "For Approval",
    "For Issuance",
    "License Issued",
    "License Declined",
    "Cancel Application",
  ];
  selectedStatus: String;
  selectedData: BusinessApplicationModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<ChangeStatusDialogComponent>,
    public dialog: MatDialog,
    private notifService : NotificationService,
    private httpRequest: HttpRequestService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.data != undefined) {
      if (this.data.selectedData) {
        this.selectedData = this.data.selectedData;
      }
    }
  }
  
  statusSelectedValue(event: MatSelectChange) {
    this.selectedStatus = event.source.triggerValue;
  }

  updateStatus() {
    if (this.selectedStatus == "") {
      this.notifService.showNotification(NotificationType.error, "Please select status.");
      return;
    }
    if (this.selectedStatus == this.selectedData.application_status) {
      this.notifService.showNotification(NotificationType.error, "Status not changed. Please select new status");
      return;
    }
    this.httpRequest.updateBusinessStatus(this.selectedData.id, this.selectedStatus).subscribe((result) => {
      if (result.statusCode == 200) {
        this.notifService.showNotification(NotificationType.success, "Successfully saved!");
        this.dialogRef.close(true);
      } else {
        this.notifService.showNotification(NotificationType.error, "Saving Data Failed!");
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
