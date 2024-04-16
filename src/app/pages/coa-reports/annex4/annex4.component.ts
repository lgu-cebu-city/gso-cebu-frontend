import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annex4',
  templateUrl: './annex4.component.html',
  styleUrls: ['./annex4.component.css'],
})
export class Annex4Component implements OnInit {
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
    'ics_rrsp',
    'semi_expendable',
    'item_description',
    'estimated_useful',
    'qty_issued',
    'office_officer_issued',
    'qty_returned',
    'office_officer_returned',
    'qty_reissued',
    'office_officer_reissued',
    'qty_disposed',
    'qty_balance',
    'amount',
    'remarks',
  ];
}
