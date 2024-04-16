import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DeliverySummaryModel } from 'src/app/data-model/delivery-summary-mode';

@Component({
  selector: 'app-delivery-report-summary-print',
  templateUrl: './delivery-report-summary-print.component.html',
  styleUrls: ['./delivery-report-summary-print.component.css']
})
export class DeliveryReportSummaryPrintComponent implements OnInit {
  @Input() summaryData: DeliverySummaryModel[];
  displayedColumns: string[] = ['poNo','poDate','canvassNo','prNo','supplierName','supplierContactNo','invoiceNo','invoiceDate','deliveryTerm','description','uom','quantity','receivedQty','balance','status'];
  datepipe: DatePipe = new DatePipe('en-US');

  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
