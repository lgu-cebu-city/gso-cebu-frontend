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
import { RequestQuotationItemsModel } from 'src/app/data-model/request-quotation-items-model';
import { RequestQuotationModel } from 'src/app/data-model/requestQuotationModel';
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
  selector: 'app-rfq-selection-dialog',
  templateUrl: './rfq-selection-dialog.component.html',
  styleUrls: ['./rfq-selection-dialog.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class RfqSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'recommendingDate', 'prNo', 'prDate', 'departmentName', 'openningDate', 'location', 'canvasserName', 'biddingType', 'approvedBudget', 'supplyDescription'];
  displayedColumnsItemDetails: string[] = ['description', 'quantity', 'uom', 'cost', 'total'];
  rfqList: RequestQuotationModel[] = [];
  itemDetails: RequestQuotationItemsModel[] = [];
  dataSource: MatTableDataSource<RequestQuotationModel> = new MatTableDataSource<RequestQuotationModel>(this.rfqList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedRFQ: RequestQuotationModel;
  selectedRFQItemsPrint: RequestQuotationItemsModel[];
  dateValue = new FormControl(moment());
  textFilterStr: string = "";

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    private dialogRef: MatDialogRef<RfqSelectionDialogComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    const ctrlValue = this.dateValue.value;
    ctrlValue.year((new Date()).getFullYear());
    ctrlValue.month((new Date()).getMonth());
    this.dateValue.setValue(ctrlValue);

    this.loadData();
  }

  loadData() {
    this.textFilterStr = "";
    this.httpRequest.getAllRequestQuotationForAOQByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.rfqList = result.data;
        this.dataSource = new MatTableDataSource<RequestQuotationModel>(this.rfqList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.rfqList.length) {
          this.selectedRFQ = this.rfqList[0];
          this.itemDetails = this.rfqList[0].items;
        } else {
          this.selectedRFQ = null;
          this.itemDetails = [];
        }
      }
    });
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  rowSelected(row: RequestQuotationModel) {
    this.selectedRFQ = row;
    this.itemDetails = row.items;
  }

  formatNumber(value: any): string {
    return value.toFixed(2);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  formatDateTime(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy h:mm a') || "";
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

  public calculateTotal() {
    return this.itemDetails?.reduce((accum, curr) => accum + curr.total, 0);
  }
  
  selectRFQ() {
    this.dialogRef.close(
      {
        requestQuotation: this.selectedRFQ
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
