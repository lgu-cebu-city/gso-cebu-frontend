import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AcceptanceAndInspectionReportItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-items-model';
import { AcceptanceAndInspectionReportModel } from 'src/app/data-model/acceptance-and-inspection-report-model';

@Component({
  selector: 'app-iar-print',
  templateUrl: './iar-print.component.html',
  styleUrls: ['./iar-print.component.css']
})
export class IarPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['itemNo', 'description', 'uom', 'quantity'];
  @Input() iarData: AcceptanceAndInspectionReportModel;
  @Input() iarItemsData: AcceptanceAndInspectionReportItemsModel[];
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
}
