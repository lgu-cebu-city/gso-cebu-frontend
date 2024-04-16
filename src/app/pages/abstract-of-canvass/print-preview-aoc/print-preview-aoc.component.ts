import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractOfCanvassModel } from 'src/app/data-model/abstract-of-canvass-model';
import { SupplierItems } from '../abstract-of-canvass-list/abstract-of-canvass-list.component';

export interface DialogData {
  selectedAOC: AbstractOfCanvassModel,
  selectedAOCData: SupplierItems[],
  selectedAOCItemsPrint: SupplierItems[][],
  itemsTotalAmt: number
}

@Component({
  selector: 'app-print-preview-aoc',
  templateUrl: './print-preview-aoc.component.html',
  styleUrls: ['./print-preview-aoc.component.css']
})
export class PrintPreviewAocComponent implements OnInit {
  selectedAOC: AbstractOfCanvassModel = null;
  selectedAOCData: SupplierItems[] = [];
  selectedAOCItemsPrint: SupplierItems[][] = [];
  itemsTotalAmt: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PrintPreviewAocComponent>,
  ) { }

  ngOnInit(): void {
    this.selectedAOC = this.data.selectedAOC;
    this.selectedAOCData = this.data.selectedAOCData;
    this.selectedAOCItemsPrint = this.data.selectedAOCItemsPrint;
    this.itemsTotalAmt = this.data.itemsTotalAmt;
  }

  public calculateTotal(_supp: number): number {
    var retVal: number = 0;
    switch (_supp) {
      case 1:
        retVal = this.selectedAOCData?.reduce((accum, curr) => accum + (curr.supplier1Price * curr.supplier1Qty), 0);
        break;
      case 2:
        retVal = this.selectedAOCData?.reduce((accum, curr) => accum + (curr.supplier2Price * curr.supplier2Qty), 0);
        break;
      case 3:
        retVal = this.selectedAOCData?.reduce((accum, curr) => accum + (curr.supplier3Price * curr.supplier3Qty), 0);
        break;
    }
    return retVal;
  }

  print() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
