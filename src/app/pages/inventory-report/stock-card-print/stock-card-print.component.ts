import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InventoryReportDetailsModel } from 'src/app/data-model/inventory-report-details-model';
import { InventoryReportModel } from 'src/app/data-model/inventory-report-model';

@Component({
  selector: 'app-stock-card-print',
  templateUrl: './stock-card-print.component.html',
  styleUrls: ['./stock-card-print.component.css']
})
export class StockCardPrintComponent implements OnInit {
  displayedColumnsDetails: string[] = ['referenceDate', 'referenceNo', 'quantity', 'issueQty', 'departmentName', 'balance'];
  @Input() irData: InventoryReportModel;
  @Input() irDetailsData: InventoryReportDetailsModel[];
  datepipe: DatePipe = new DatePipe('en-US');

  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
