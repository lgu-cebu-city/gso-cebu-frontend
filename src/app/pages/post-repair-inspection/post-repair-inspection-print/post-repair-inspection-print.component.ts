import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PostRepairInspectionItemsModel } from 'src/app/data-model/post-repair-inspection-items-model';
import { PostRepairInspectionModel } from 'src/app/data-model/post-repair-inspection-model';

@Component({
  selector: 'app-post-repair-inspection-print',
  templateUrl: './post-repair-inspection-print.component.html',
  styleUrls: ['./post-repair-inspection-print.component.css']
})
export class PostRepairInspectionPrintComponent implements OnInit {
  @Input() priData: PostRepairInspectionModel;
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  itemDisplayedColumns: string[] = ['jobDescription', 'quantity', 'unitMeasure', 'description', 'unitCost', 'totalCost'];
  totalAmount: number = 0.00;
  datepipe: DatePipe = new DatePipe('en-US');
  
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
