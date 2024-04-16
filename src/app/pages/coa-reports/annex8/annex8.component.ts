import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annex8',
  templateUrl: './annex8.component.html',
  styleUrls: ['./annex8.component.css'],
})
export class Annex8Component implements OnInit {
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
  ];
  displayedColumns: string[] = [
    'article',
    'description',
    'semi_expendable',
    'unit_of_measure',
    'unit_value',
    'balance_per_card',
    'on_hand_per_count',
    'shortageoverage',
    'remarks',
  ];
}
