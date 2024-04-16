import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { DialogData, RequestForRepairComponent } from '../request-for-repair.component';

@Component({
  selector: 'app-rfr-repair-result-dialog',
  templateUrl: './rfr-repair-result-dialog.component.html',
  styleUrls: ['./rfr-repair-result-dialog.component.css']
})
export class RfrRepairResultDialogComponent implements OnInit {
  repairResult: string = "";
  repairRemarks: string = "";
  btnText: string = "Add";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<RequestForRepairComponent>,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initItemForm();
  }

  initItemForm() {
    if (this.data != undefined && this.data.repairResult != undefined) {
      this.repairResult = this.data.repairResult;
      this.repairRemarks = this.data.repairRemarks;
      this.btnText = "Update";
    }
  }

  addItem() {
    if (!this.repairResult) {
      this.notifService.showNotification(NotificationType.error, "Please select repair result!");
      return;
    }
    if (this.repairResult == "Others" && !this.repairRemarks) {
      this.notifService.showNotification(NotificationType.error, "Please specify repair result!");
      return;
    }

    this.dialogRef.close(
      {
        repairResult: this.repairResult,
        repairRemarks: this.repairRemarks
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
