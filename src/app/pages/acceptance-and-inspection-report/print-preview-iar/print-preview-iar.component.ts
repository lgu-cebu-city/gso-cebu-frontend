import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AcceptanceAndInspectionReportItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-items-model';
import { AcceptanceAndInspectionReportModel } from 'src/app/data-model/acceptance-and-inspection-report-model';

export interface DialogData {
  selectedIar: AcceptanceAndInspectionReportModel,
  selectedIarItemsPrint: AcceptanceAndInspectionReportItemsModel[][]
}

@Component({
  selector: 'app-print-preview-iar',
  templateUrl: './print-preview-iar.component.html',
  styleUrls: ['./print-preview-iar.component.css']
})
export class PrintPreviewIarComponent implements OnInit {
  selectedIar: AcceptanceAndInspectionReportModel;
  selectedIarItemsPrint: AcceptanceAndInspectionReportItemsModel[][] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PrintPreviewIarComponent>,
  ) { }

  ngOnInit(): void {
    this.selectedIar = this.data.selectedIar;
    this.selectedIarItemsPrint = this.data.selectedIarItemsPrint;
  }

  print() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
