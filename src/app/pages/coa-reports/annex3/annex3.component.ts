import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annex3',
  templateUrl: './annex3.component.html',
  styleUrls: ['./annex3.component.css'],
})
export class Annex3Component implements OnInit {
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
  ];
  displayedColumns: string[] = [
    'qty',
    'unit',
    'unit_cost',
    'total_cost',
    'description',
    'item_no',
    'est_useful_life',
  ];
}
