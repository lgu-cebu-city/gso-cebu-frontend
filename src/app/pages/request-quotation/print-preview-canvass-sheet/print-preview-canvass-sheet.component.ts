import { Component, Inject, OnInit } from '@angular/core';
import { RequestQuotationItemsModel } from 'src/app/data-model/request-quotation-items-model';
import { RequestQuotationModel } from 'src/app/data-model/requestQuotationModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  selectedRFQ: RequestQuotationModel,
  selectedRFQItemsPrint: RequestQuotationItemsModel[][]
}

@Component({
  selector: 'app-print-preview-canvass-sheet',
  templateUrl: './print-preview-canvass-sheet.component.html',
  styleUrls: ['./print-preview-canvass-sheet.component.css']
})
export class PrintPreviewCanvassSheetComponent implements OnInit {
  selectedRFQ: RequestQuotationModel = null;
  selectedRFQItemsPrint: RequestQuotationItemsModel[][] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PrintPreviewCanvassSheetComponent>,
  ) { }

  ngOnInit(): void {
    this.selectedRFQ = this.data.selectedRFQ;
    this.selectedRFQItemsPrint = this.data.selectedRFQItemsPrint;
  }

  public calculateTotal() {
    if (this.selectedRFQ) {
      return this.selectedRFQ.items?.reduce((accum, curr) => accum + curr.total, 0);
    } else {
      return 0;
    }
  }

  print() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
