import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { DialogData } from '../purchase-request.component';

@Component({
  selector: 'app-purchase-request-logs',
  templateUrl: './purchase-request-logs.component.html',
  styleUrls: ['./purchase-request-logs.component.css']
})
export class PurchaseRequestLogsComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['prNo','prDate','transactionNo', 'transactionDate', 'title', 'departmentName', 'sectionName', 'alobsNo', 'alobsDate', 'saiNo', 'saiDate', 'ppNo', 'sourceOfFund', 'rationale', 'procurementMode'];
  displayedColumnsItemDetails: string[] = ['description', 'quantity', 'uom', 'cost', 'total', 'remarks'];
  prList: PurchaseRequestModel[] = [];
  itemDetails: PurchaseRequestItemsModel[] = [];
  dataSource: MatTableDataSource<PurchaseRequestModel> = new MatTableDataSource<PurchaseRequestModel>(this.prList);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
  selectedPR: PurchaseRequestModel;
  showImage: boolean = false;
  module = this;

  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.httpRequest.getAllPurchaseRequestLogsByPrId(this.data.selectedData.id).subscribe((result) => {
      if (result.statusCode == 200) {
        this.prList = result.data;
        this.showImage = this.prList.length == 0;
        this.dataSource = new MatTableDataSource<PurchaseRequestModel>(this.prList);
        if (this.prList.length) {
          this.selectedPR = this.prList[0];
          this.itemDetails = this.prList[0].items;
        } else {
          this.selectedPR = null;
          this.itemDetails = [];
        }
      }
    });
  }

  rowSelected(row: PurchaseRequestModel) {
    this.selectedPR = row;
    this.itemDetails = row.items;
  }

  printData(index: number){
    this.selectedPR = this.prList[index];
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  formatNumber(value: any): string {
    return value.toFixed(2);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
