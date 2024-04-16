import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AbstractOfCanvassModel } from 'src/app/data-model/abstract-of-canvass-model';
import { SupplierItems } from '../abstract-of-canvass-list/abstract-of-canvass-list.component';

@Component({
  selector: 'app-aoq-print',
  templateUrl: './aoq-print.component.html',
  styleUrls: ['./aoq-print.component.css']
})
export class AoqPrintComponent implements OnInit {
  @Input() aocData: AbstractOfCanvassModel;
  @Input() printData: SupplierItems[];
  @Input() currPage: number;
  @Input() maxPage: number;
  @Input() supp1GrandTotal: number;
  @Input() supp2GrandTotal: number;
  @Input() supp3GrandTotal: number;
  @Input() itemsTotal: number;
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  dataSource: MatTableDataSource<SupplierItems> = new MatTableDataSource<SupplierItems>([]);
  
  displayedColumns: string[] = [
    'itemNo',
    'quantity',
    'uom',
    'description',
    'supplier1Price',
    'supplier2Price',
    'supplier3Price'
  ];
  
  displayedColumnsSingleSupp: string[] = [
    'itemNo',
    'quantity',
    'uom',
    'description',
    'supplier1Price',
  ];

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource<SupplierItems>(this.printData);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMMM d, yyyy') || "";
  }
}
