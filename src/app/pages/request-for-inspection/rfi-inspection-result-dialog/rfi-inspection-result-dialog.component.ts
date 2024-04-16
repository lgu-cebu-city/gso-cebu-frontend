import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { DialogData, RequestForInspectionComponent } from '../request-for-inspection.component';

@Component({
  selector: 'app-rfi-inspection-result-dialog',
  templateUrl: './rfi-inspection-result-dialog.component.html',
  styleUrls: ['./rfi-inspection-result-dialog.component.css']
})
export class RfiInspectionResultDialogComponent implements OnInit {
  inspectionResult: string = "";
  inspectionRemarks: string = "";
  btnText: string = "Add";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<RequestForInspectionComponent>,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initItemForm();
  }

  initItemForm() {
    if (this.data != undefined && this.data.inspectionResult != undefined) {
      this.inspectionResult = this.data.inspectionResult;
      this.inspectionRemarks = this.data.inspectionRemarks;
      this.btnText = "Update";
    }
  }

  addItem() {
    if (!this.inspectionResult) {
      this.notifService.showNotification(NotificationType.error, "Please select inspection result!");
      return;
    }
    if (this.inspectionResult == "Others" && !this.inspectionRemarks) {
      this.notifService.showNotification(NotificationType.error, "Please specify inspection result!");
      return;
    }

    this.dialogRef.close(
      {
        inspectionResult: this.inspectionResult,
        inspectionRemarks: this.inspectionRemarks
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
