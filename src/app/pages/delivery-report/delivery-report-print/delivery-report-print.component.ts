import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PurchaseOrderItemModel } from 'src/app/data-model/purchase-order-item-model';
import { PurchaseOrderModel } from 'src/app/data-model/purchase-order-model';

@Component({
  selector: 'app-delivery-report-print',
  templateUrl: './delivery-report-print.component.html',
  styleUrls: ['./delivery-report-print.component.css']
})
export class DeliveryReportPrintComponent implements OnInit {
  @Input() poData: PurchaseOrderModel;
  @Input() poItemsData: PurchaseOrderItemModel[];
  displayedColumnsItemDetails: string[] = ['description', 'uom', 'quantity'];
  displayedColumnsItemDRDetails: string[] = ['referenceNo','referenceDate','invoiceNo','invoiceDate','receivedQuantity','balance'];
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
