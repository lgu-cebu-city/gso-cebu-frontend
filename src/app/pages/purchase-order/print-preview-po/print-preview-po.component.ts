import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseOrderItemModel } from 'src/app/data-model/purchase-order-item-model';
import { PurchaseOrderModel } from 'src/app/data-model/purchase-order-model';

export interface DialogData {
  selectedPo: PurchaseOrderModel,
  selectedPoItemsPrint: PurchaseOrderItemModel[][]
}

@Component({
  selector: 'app-print-preview-po',
  templateUrl: './print-preview-po.component.html',
  styleUrls: ['./print-preview-po.component.css']
})
export class PrintPreviewPoComponent implements OnInit {
  selectedPo: PurchaseOrderModel = null;
  selectedPoItemsPrint: PurchaseOrderItemModel[][] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PrintPreviewPoComponent>,
  ) { }

  ngOnInit(): void {
    this.selectedPo = this.data.selectedPo;
    this.selectedPoItemsPrint = this.data.selectedPoItemsPrint;
  }

  public calculateTotal() {
    if (this.selectedPo) {
      return this.selectedPo.items?.reduce((accum, curr) => accum + curr.total, 0);
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
