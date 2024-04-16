import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WasteMaterialReportInspectionCertificateModel } from 'src/app/data-model/waste-material-report-inspection-certificate-model';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { DialogData, WasteMaterialReportComponent } from '../waste-material-report.component';

@Component({
  selector: 'app-certificate-inspection-entry-dialog',
  templateUrl: './certificate-inspection-entry-dialog.component.html',
  styleUrls: ['./certificate-inspection-entry-dialog.component.css']
})
export class CertificateInspectionEntryDialogComponent implements OnInit {
  quantity: number = 1;
  description: string = "";
  transferredTo: string = "";
  btnText: string = "Add";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<WasteMaterialReportComponent>,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.data != undefined && this.data.selectedCertificate != undefined) {
      this.quantity = this.data.selectedCertificate.quantity;
      this.description = this.data.selectedCertificate.description;
      this.transferredTo = this.data.selectedCertificate.transferTo;
      this.btnText = "Update";
    }
  }

  addItem() {
    if (this.quantity <= 0) {
      this.notifService.showNotification(NotificationType.error, "Please input quantity!");
      return;
    }
    if (!this.description) {
      this.notifService.showNotification(NotificationType.error, "Please input description!");
      return;
    }
    if (this.description == "Transferred Without Cost to" && !this.transferredTo) {
      this.notifService.showNotification(NotificationType.error, "Please input transfer location!");
      return;
    }
    var retItem = new WasteMaterialReportInspectionCertificateModel(
      "",
      this.quantity,
      this.description,
      this.transferredTo
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
