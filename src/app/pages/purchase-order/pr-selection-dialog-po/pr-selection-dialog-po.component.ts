import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-pr-selection-dialog-po',
  templateUrl: './pr-selection-dialog-po.component.html',
  styleUrls: ['./pr-selection-dialog-po.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PrSelectionDialogPoComponent implements OnInit {
  displayedColumnsPR: string[] = ['prNo','prDate','departmentName','sourceOfFund','rationale'];
  displayedColumnsPRSOF: string[] = ['year', 'sofDescription', 'amount'];
  displayedColumnsPRItemDetails: string[] = ['description', 'quantity', 'uom', 'cost', 'total'];
  prList: PurchaseRequestModel[] = [];
  dataSource: MatTableDataSource<PurchaseRequestModel> = new MatTableDataSource<PurchaseRequestModel>(this.prList);
  itemDetails: PurchaseRequestItemsModel[];
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedPR: PurchaseRequestModel;
  dateValue = new FormControl(moment());
  textFilterStr: string = "";
  dateFilterType: string = "Quarter";
  qtrFilter: string = "";
  qtrYearFilter: string = (new Date).getFullYear().toString();
  qtrYearSelection: string[] = [];

  constructor(
    private authService: AuthService,
    private httpRequest: HttpRequestService,
    public router: Router,
    private dialogRef: MatDialogRef<PrSelectionDialogPoComponent>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.setQuarter(new Date());
    const ctrlValue = this.dateValue.value;
    ctrlValue.year((new Date()).getFullYear());
    ctrlValue.month((new Date()).getMonth());
    this.dateValue.setValue(ctrlValue);

    for (var i = 2022; i <= (new Date).getFullYear(); i ++) {
      this.qtrYearSelection.push(i.toString());
    }

    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setQuarter(date: Date) {
    switch(Math.floor(((date).getMonth() + 3) / 3)) {
      case 1:
        this.qtrFilter = "Q1"
        break;
      case 2:
        this.qtrFilter = "Q2"
        break;
      case 3:
        this.qtrFilter = "Q3"
        break;
      case 4:
        this.qtrFilter = "Q4"
        break;
    }
  }

  loadData() {
    this.textFilterStr = "";
    switch (this.dateFilterType) {
      case "Monthly":
        this.httpRequest.getAllPurchaseRequestForConsoByMonthYearDBM(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
          if (result.statusCode == 200) {
            this.formatData(result.data);
          }
        });
        break;
      case "Quarter":
        this.httpRequest.getAllPurchaseRequestForConsoByQuarterDBM(this.qtrFilter, this.qtrYearFilter).subscribe((result) => {
          if (result.statusCode == 200) {
            this.formatData(result.data);
          }
        });
        break
    }
  }

  formatData(data: PurchaseRequestModel[]) {
    this.prList = data;
    this.dataSource = new MatTableDataSource<PurchaseRequestModel>(this.prList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.prList.length) {
      this.selectedPR = this.prList[0];
      this.itemDetails = this.prList[0].items;
    } else {
      this.selectedPR = null;
      this.itemDetails = [];
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  rowSelected(row: PurchaseRequestModel) {
    this.selectedPR = row;
    this.itemDetails = row.items;
  }

  formatNumber(value: any): string {
    return value.toFixed(2);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.dateValue.value;
    ctrlValue.year(normalizedYear.year());
    this.dateValue.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.dateValue.value;
    ctrlValue.month(normalizedMonth.month());
    this.dateValue.setValue(ctrlValue);
    datepicker.close();
    this.loadData();
  }

  selectQtr() {
    this.loadData();
  }

  public calculateTotal() {
    return this.itemDetails?.reduce((accum, curr) => accum + curr.total, 0);
  }
  
  selectPR() {
    this.dialogRef.close(
      {
        purchaseRequest: this.selectedPR
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
