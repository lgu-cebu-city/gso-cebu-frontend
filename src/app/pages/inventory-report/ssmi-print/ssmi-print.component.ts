import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InventorySSMIModel } from 'src/app/data-model/inventory-ssmi-model';

@Component({
  selector: 'app-ssmi-print',
  templateUrl: './ssmi-print.component.html',
  styleUrls: ['./ssmi-print.component.css']
})
export class SsmiPrintComponent implements OnInit {
  displayedColumnsDetails: string[] = ['code', 'description', 'uom', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'totalQty', 'price', 'totalCost'];
  @Input() ssmiData: InventorySSMIModel[];
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  ngOnInit(): void {
  }

  beginningDate(): string {
    var d = new Date((new Date()).getFullYear(), 0, 1);
    return this.datepipe.transform(d, 'MMMM d, yyyy') || "";
  }

  endingDate(): string {
    var d = new Date((new Date()).getFullYear(), 11, 31);
    return this.datepipe.transform(d, 'MMMM d, yyyy') || "";
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMMM d, yyyy') || "";
  }

}
