import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PreRepairInspectionItemsModel } from 'src/app/data-model/pre-repair-inspection-items-model';
import { PreRepairInspectionModel } from 'src/app/data-model/pre-repair-inspection-model';

@Component({
  selector: 'app-pre-repair-inspection-print',
  templateUrl: './pre-repair-inspection-print.component.html',
  styleUrls: ['./pre-repair-inspection-print.component.css']
})
export class PreRepairInspectionPrintComponent implements OnInit {
  @Input() priData: PreRepairInspectionModel;
  @Input() priItemsData: PreRepairInspectionItemsModel[];
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  itemDisplayedColumns: string[] = ['description', 'quantity', 'unitMeasure'];
  totalAmount: number = 0.00;
  datepipe: DatePipe = new DatePipe('en-US');
  
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
