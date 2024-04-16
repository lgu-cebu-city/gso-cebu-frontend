import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annex10',
  templateUrl: './annex10.component.html',
  styleUrls: ['./annex10.component.css'],
})
export class Annex10Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  dataSource: any[] = [{}, {}, {}, {}, {}, {},{}, {}, {}, {}, {}, {}, {}];
  displayedColumns: string[] = [
    'date',
    'particulars',
    'semi_exp',
    'qty',
    'unit_cost',
    'total_cost',
    'acc_imp_losses',
    'carrying_amt',
    'remarks',
    'sale',
    'transfer',
    'destruction',
    'others',
    'total',
    'appraised_value',
    'or_no',
    'amount',
  ];
}
