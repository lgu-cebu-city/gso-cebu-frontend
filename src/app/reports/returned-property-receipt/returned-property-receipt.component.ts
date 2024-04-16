import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { ReturnedPropertyReceiptXLSX } from './returned-property-receipt.xlsx';

class headerData {
  entityName: string;
  date: string;
  RRSPNo: string;
  returnedBy: string;
  receivedBy: string;
  details: detailData[];
}

class detailData {
  itemDescription: string;
  quantity: string;
  icsNo: string;
  user: string;
  remarks: string;
}

@Component({
  selector: 'app-returned-property-receipt',
  templateUrl: './returned-property-receipt.component.html',
  styleUrls: ['./returned-property-receipt.component.css']
})
export class ReturnedPropertyReceiptComponent implements OnInit {
  env = environment;
  displayedColumns: string[] = ['entityName','date','RRSPNo','returnedBy','receivedBy'];
  irList: headerData[] = [];
  displayedColumnsItemDetails: string[] = ['itemDescription','quantity','icsNo','user','remarks'];
  details: detailData[] = [];
  detailsPrint: detailData[] = [];
  dataSource: MatTableDataSource<headerData> = new MatTableDataSource<headerData>(this.irList);
  selectedIr: headerData;
  datepipe: DatePipe = new DatePipe('en-US');
  excelFormat = new ReturnedPropertyReceiptXLSX();

  constructor(
    private httpRequest: HttpRequestService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;
  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    // this.httpRequest.getAllPropertyInventory().subscribe((result) => {
    //   if (result.statusCode == 200) {
    //     this.irList = result.data;
    //     this.dataSource = new MatTableDataSource<headerData>(this.irList);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     if (this.irList.length) {
    //       this.selectedIr = this.irList[0];
    //       this.details = this.irList[0].details;
    //       this.loadItemsForPrint(this.irList[0].details);
    //     }
    //   }
    // });
  }

  loadItemsForPrint(d: detailData[]) {
    // this.detailsPrint = [];
    // var runningBalance: number = 0;
    // for (var i = 0; i < 20; i++) {
    //   var item: detailData;
    //   if (d[i]) {
    //     if (d[i].method == "+") {
    //       runningBalance += d[i].reportQty;
    //     } else if (d[i].method == "-") {
    //       runningBalance -= d[i].reportQty;
    //     }
    //     d[i].runningBalance = runningBalance;

    //     item = d[i];
    //   } else {
    //     item = new detailData(
    //       "",
    //       "",
    //       "",
    //       new Date(),
    //       "",
    //       0,
    //       0,
    //       "",
    //       0
    //     );
    //   }
    //   this.detailsPrint.push(item);
    // }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  rowSelected(row: headerData) {
    this.selectedIr = row;
    this.details = row.details;
    this.loadItemsForPrint(row.details);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  formatNumber(value: number): string {
    return Number(value).toFixed(2);
  }

  printInventoryReport(){
    this.selectedIr = this.selectedIr;
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  exportToExcel()
  {
    this.excelFormat.generateXLSXFormat(new headerData);
  }
}
