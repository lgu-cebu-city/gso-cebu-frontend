import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annex5',
  templateUrl: './annex5.component.html',
  styleUrls: ['./annex5.component.css'],
})
export class Annex5Component implements OnInit {
  Donation = false;
  Reassignment = false;
  Relocate = false;
  Others = false;
  constructor() {}

  ngOnInit(): void {}
  dataSource: any[] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  displayedColumns: string[] = [
    'date',
    'item_no',
    'ics_no',
    'description',
    'amount',
    'condition_inv',
  ];
}
