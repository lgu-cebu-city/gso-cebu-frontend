import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';

export interface DialogData {
  selectedPR: PurchaseRequestModel,
  selectedPRItemsPrint: PurchaseRequestItemsModel[][]
}

@Component({
  selector: 'app-print-preview-pr',
  templateUrl: './print-preview-pr.component.html',
  styleUrls: ['./print-preview-pr.component.css']
})
export class PrintPreviewPrComponent implements OnInit {
  selectedPR: PurchaseRequestModel = null;
  selectedPRItemsPrint: PurchaseRequestItemsModel[][] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PrintPreviewPrComponent>,
  ) { }

  ngOnInit(): void {
    this.selectedPR = this.data.selectedPR;
    this.selectedPRItemsPrint = this.data.selectedPRItemsPrint;
  }

  public calculateTotal() {
    if (this.selectedPR) {
      return this.selectedPR.items?.reduce((accum, curr) => accum + curr.total, 0);
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
