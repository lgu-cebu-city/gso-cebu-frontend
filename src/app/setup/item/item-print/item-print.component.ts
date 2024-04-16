import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/data-model/item';

@Component({
  selector: 'app-item-print',
  templateUrl: './item-print.component.html',
  styleUrls: ['./item-print.component.css']
})
export class ItemPrintComponent implements OnInit {
  displayedColumns: string[] = ['itemNo', 'itemCode', 'description', 'uom', 'price'];
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  @Input() itemData: Item[];
  @Input() currPage: number;
  @Input() maxPage: number;

  constructor() { }

  ngOnInit(): void {
  }

}
