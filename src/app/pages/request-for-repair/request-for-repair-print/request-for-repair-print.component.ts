import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RequestForRepairItemModel } from 'src/app/data-model/request-for-repair-item-model';
import { RequestForRepairModel } from 'src/app/data-model/request-for-repair-model';

@Component({
  selector: 'app-request-for-repair-print',
  templateUrl: './request-for-repair-print.component.html',
  styleUrls: ['./request-for-repair-print.component.css']
})
export class RequestForRepairPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['description', 'quantity', 'new', 'additional', 'urgent', 'others', 'remarks'];
  @Input() rfrData: RequestForRepairModel;
  @Input() rfrItemsData: RequestForRepairItemModel[];
  datepipe: DatePipe = new DatePipe('en-US');

  constructor() { }

  ngOnInit(): void {
  }

  natureOfRequest(item: string, _nor: string): boolean {
    return item?.split(" | ")[0] == _nor;
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MM/dd/yyyy') || "";
  }

}
