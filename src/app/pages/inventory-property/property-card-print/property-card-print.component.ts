import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InventoryReportDetailsModel } from 'src/app/data-model/inventory-report-details-model';
import { InventoryReportModel } from 'src/app/data-model/inventory-report-model';

@Component({
  selector: 'app-property-card-print',
  templateUrl: './property-card-print.component.html',
  styleUrls: ['./property-card-print.component.css']
})
export class PropertyCardPrintComponent implements OnInit {
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
