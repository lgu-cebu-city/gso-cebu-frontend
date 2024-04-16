import { Component, Input, OnInit } from '@angular/core';
import { InventoryReportModel } from 'src/app/data-model/inventory-report-model';

@Component({
  selector: 'app-inventory-report-print',
  templateUrl: './inventory-report-print.component.html',
  styleUrls: ['./inventory-report-print.component.css']
})
export class InventoryReportPrintComponent implements OnInit {
  displayedColumnsDetails: string[] = ['itemCode', 'description', 'uom', 'receivedQty', 'withdrawnQty', 'returnQty', 'onhandQty'];
  @Input() irData: InventoryReportModel[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
