import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PropertyAccountabilityItemModel } from 'src/app/data-model/property-accountability-item-model';
import { PropertyAccountabilityModel } from 'src/app/data-model/property-accountability-model';

@Component({
  selector: 'app-property-accountability-slip-print',
  templateUrl: './property-accountability-slip-print.component.html',
  styleUrls: ['./property-accountability-slip-print.component.css']
})
export class PropertyAccountabilitySlipPrintComponent implements OnInit {
  @Input() pasData: PropertyAccountabilityModel;
  @Input() pasItemsData: PropertyAccountabilityItemModel[];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description', 'qty'];
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
}
