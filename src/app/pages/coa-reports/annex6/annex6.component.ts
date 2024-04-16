import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annex6',
  templateUrl: './annex6.component.html',
  styleUrls: ['./annex6.component.css'],
})
export class Annex6Component implements OnInit {
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
    'item_description',
    'quantity',
    'ics_no',
    'end_user',
    'remarks',
  ];
}
