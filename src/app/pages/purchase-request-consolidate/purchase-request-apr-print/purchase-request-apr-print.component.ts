import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';

@Component({
  selector: 'app-purchase-request-apr-print',
  templateUrl: './purchase-request-apr-print.component.html',
  styleUrls: ['./purchase-request-apr-print.component.scss']
})
export class PurchaseRequestAprPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['itemNo', 'description', 'quantity', 'uom', 'cost', 'total'];
  @Input() prData: PurchaseRequestModel;
  @Input() prItemsData: PurchaseRequestItemsModel[];
  @Input() currPage: number;
  @Input() maxPage: number;
  @Input() grandTotal: number;
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'dd-MMM-yy') || "";
  }

  public calculateTotal() {
    return this.prItemsData?.reduce((accum, curr) => accum + curr.total, 0);
  }
}
