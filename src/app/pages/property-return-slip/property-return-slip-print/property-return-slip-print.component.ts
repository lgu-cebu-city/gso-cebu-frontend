import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PropertyReturnItemModel } from 'src/app/data-model/property-return-item-model';
import { PropertyReturnModel } from 'src/app/data-model/property-return-model';

@Component({
  selector: 'app-property-return-slip-print',
  templateUrl: './property-return-slip-print.component.html',
  styleUrls: ['./property-return-slip-print.component.css']
})
export class PropertyReturnSlipPrintComponent implements OnInit {
  @Input() prsData: PropertyReturnModel;
  @Input() prsItemsData: PropertyReturnItemModel[];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description', 'qty'];
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  currentYear(): string {
    return (new Date()).getFullYear().toString();
  }
}
