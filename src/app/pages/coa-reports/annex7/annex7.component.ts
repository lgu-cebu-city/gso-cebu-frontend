import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annex7',
  templateUrl: './annex7.component.html',
  styleUrls: ['./annex7.component.css'],
})
export class Annex7Component implements OnInit {
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
    {},
    {},
    {},
    {},
    {},
  ];
  displayedColumns: string[] = [
    'ics_no',
    'responsibility',
    'semi_expendable',
    'item_description',
    'unit',
    'quantity',
    'unit_cost',
    'amount',
  ];
}
