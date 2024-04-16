import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RequestQuotationItemsModel } from 'src/app/data-model/request-quotation-items-model';
import { RequestQuotationModel } from 'src/app/data-model/requestQuotationModel';

@Component({
  selector: 'app-request-quotation-print',
  templateUrl: './request-quotation-print.component.html',
  styleUrls: ['./request-quotation-print.component.css']
})
export class RequestQuotationPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['itemNo', 'description', 'quantity', 'uom', 'supplySpec'];
  @Input() rfqData: RequestQuotationModel;
  @Input() rfqItemsData: RequestQuotationItemsModel[];
  @Input() currPage: number;
  @Input() maxPage: number;
  @Input() grandTotal: number;
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  formatTime(value: any): string {
    return this.datepipe.transform(value, 'h:mm a') || "";
  }

}
