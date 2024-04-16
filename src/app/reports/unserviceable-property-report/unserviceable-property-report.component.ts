import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { UnserviceablePropertyReportXLSX } from './unserviceable-property-report.xlsx';

class headerData {
  entityName: string;
  fundCluster: string;
  accountableOfficer: string;
  designation: string;
  station: string;
  requestedBy: string;
  approvedBy: string;
  inspectionOfficer: string;
  witness: string;
  details: detailData[];
}

class detailData {
  dateAcquired: string;
  particulars: string;
  propertyNo: string;
  quantity: string;
  unitCost: string;
  totalCost: string;
  accumulatedImpairmentLosses: string;
  carryingAmount: string;
  remarks: string;
  saleDisposal: string;
  transferDisposal: string;
  destructionDisposal: string;
  othersDisposal: string;
  totalDisposal: string;
  appraisedValue: string;
  orNo: string;
  orAmount: string;
}

@Component({
  selector: 'app-unserviceable-property-report',
  templateUrl: './unserviceable-property-report.component.html',
  styleUrls: ['./unserviceable-property-report.component.css']
})
export class UnserviceablePropertyReportComponent implements OnInit {
  env = environment;
  displayedColumns: string[] = ['entityName','fundCluster','accountableOfficer','designation','station','requestedBy','approvedBy','inspectionOfficer','witness'];
  irList: headerData[] = [];
  displayedColumnsItemDetails: string[] = ['dateAcquired','particulars','propertyNo','quantity','unitCost','totalCost','accumulatedImpairmentLosses','carryingAmount','remarks','saleDisposal','transferDisposal','destructionDisposal','othersDisposal','totalDisposal','appraisedValue','orNo','orAmount'];
  details: detailData[] = [];
  detailsPrint: detailData[] = [];
  dataSource: MatTableDataSource<headerData> = new MatTableDataSource<headerData>(this.irList);
  selectedIr: headerData;
  datepipe: DatePipe = new DatePipe('en-US');
  excelFormat = new UnserviceablePropertyReportXLSX();

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
    //     this.dataSource = new MatTableDataSource<InventoryReportModel>(this.irList);
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
    //   var item: InventoryReportDetailsModel;
    //   if (d[i]) {
    //     if (d[i].method == "+") {
    //       runningBalance += d[i].reportQty;
    //     } else if (d[i].method == "-") {
    //       runningBalance -= d[i].reportQty;
    //     }
    //     d[i].runningBalance = runningBalance;

    //     item = d[i];
    //   } else {
    //     item = new InventoryReportDetailsModel(
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
