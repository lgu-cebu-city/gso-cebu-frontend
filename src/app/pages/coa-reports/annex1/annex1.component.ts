import { Component, Input, OnInit } from '@angular/core';
import { InventoryReportDetailsModel } from 'src/app/data-model/inventory-report-details-model';
import { InventoryReportModel } from 'src/app/data-model/inventory-report-model';

@Component({
  selector: 'app-annex1',
  templateUrl: './annex1.component.html',
  styleUrls: ['./annex1.component.css'],
})
export class Annex1Component implements OnInit {
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
    'issue_item_no',
    'issue_qty',
    'issue_officer',
    'balance_qty',
    'amount',
    'remarks',
  ];
}
