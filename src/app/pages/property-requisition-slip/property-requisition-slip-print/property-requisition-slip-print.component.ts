import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PropertyRequisitionItemModel } from 'src/app/data-model/property-requisition-item-model';
import { PropertyRequisitionModel } from 'src/app/data-model/property-requisition-model';

@Component({
  selector: 'app-property-requisition-slip-print',
  templateUrl: './property-requisition-slip-print.component.html',
  styleUrls: ['./property-requisition-slip-print.component.css']
})
export class PropertyRequisitionSlipPrintComponent implements OnInit {
  @Input() prqData: PropertyRequisitionModel;
  @Input() prqItemsData: PropertyRequisitionItemModel[];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description', 'qty'];
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
}
