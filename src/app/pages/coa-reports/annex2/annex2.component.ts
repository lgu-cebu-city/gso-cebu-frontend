import { Component, Input, OnInit } from '@angular/core';
import { InventoryReportDetailsModel } from 'src/app/data-model/inventory-report-details-model';
import { InventoryReportModel } from 'src/app/data-model/inventory-report-model';

@Component({
  selector: 'app-annex2',
  templateUrl: './annex2.component.html',
  styleUrls: ['./annex2.component.css'],
})
export class Annex2Component implements OnInit {
  @Input() irData: InventoryReportModel;
  @Input() irDetailsData: InventoryReportDetailsModel[];
  constructor() {}

  ngOnInit(): void {}
  dataSource: any[] = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ];
  displayedColumns: string[] = [
    'date',
    'reference',
    'receipt_qty',
    'receipt_unit_cost',
    'receipt_total_cost',
    'issue_trans_adjust',
    'accumulated',
    'adjusted_cost',
    'nature_repair',
    'amount',
  ];
}
