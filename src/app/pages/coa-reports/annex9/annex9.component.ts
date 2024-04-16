import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annex9',
  templateUrl: './annex9.component.html',
  styleUrls: ['./annex9.component.css'],
})
export class Annex9Component implements OnInit {
  Donation = false;
  Reassignment = false;
  Relocate = false;
  Others = false;
  constructor() {}

  ngOnInit(): void {}
  dataSource: any[] = [{}, {}, {}, {}, {}, {},];
  displayedColumns: string[] = [
    'property_no',
    'description',
    'acquisition_cost',
  ];
}
