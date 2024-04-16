import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AcceptanceAndInspectionReportItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-items-model';
import { AcceptanceAndInspectionReportModel } from 'src/app/data-model/acceptance-and-inspection-report-model';

@Component({
  selector: 'app-inspection-and-acceptance-report-print',
  templateUrl: './inspection-and-acceptance-report-print.component.html',
  styleUrls: ['./inspection-and-acceptance-report-print.component.css']
})
export class InspectionAndAcceptanceReportPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['itemNo', 'uom', 'quantity', 'description', 'brand'];
  datepipe: DatePipe = new DatePipe('en-US');
  
  @Input() iarData: AcceptanceAndInspectionReportModel;
  @Input() iarItemsData: AcceptanceAndInspectionReportItemsModel[];

  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
