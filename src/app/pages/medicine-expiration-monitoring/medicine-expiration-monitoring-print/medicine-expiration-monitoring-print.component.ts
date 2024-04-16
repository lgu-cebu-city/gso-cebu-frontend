import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

interface MedicineGenericNode {
  id: string;
  name: string;
  count: number;
  children: MedicineNonGenericNode[];
  isExpanded: boolean;
}
interface MedicineNonGenericNode {
  id: string;
  name: string;
  count: number;
  children: MedicineLotNoNode[];
  isExpanded: boolean;
}
interface MedicineLotNoNode {
  lotNo: string;
  expirationDate: Date;
}

@Component({
  selector: 'app-medicine-expiration-monitoring-print',
  templateUrl: './medicine-expiration-monitoring-print.component.html',
  styleUrls: ['./medicine-expiration-monitoring-print.component.css']
})
export class MedicineExpirationMonitoringPrintComponent implements OnInit {
  displayedColumns: string[] = ['name', 'lotNo', 'expirationDate', 'count'];
  displayedColumnsTest: string[] = ['name', 'count'];
  displayedColumnsssTest: string[] = ['lotNo', 'expirationDate'];
  datepipe: DatePipe = new DatePipe('en-US');

  @Input() printData: MedicineGenericNode[];

  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
