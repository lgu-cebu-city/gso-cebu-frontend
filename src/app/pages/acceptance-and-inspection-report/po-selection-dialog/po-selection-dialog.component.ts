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
import { PurchaseOrderItemModel } from 'src/app/data-model/purchase-order-item-model';
import { PurchaseOrderModel } from 'src/app/data-model/purchase-order-model';
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
  selector: 'app-po-selection-dialog',
  templateUrl: './po-selection-dialog.component.html',
  styleUrls: ['./po-selection-dialog.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PoSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo','transactionDate','canvassNo', 'prNo', 'procurementMode', 'supplierName', 'supplierAddress', 'supplierContactNo', 'deliveryPlace', 'deliveryDate', 'deliveryTerm', 'paymentTerm'];
  displayedColumnsItemDetails: string[] = ['description', 'uom', 'quantity', 'cost', 'total'];
  purchaseOrderList: PurchaseOrderModel[] = [];
  itemDetails: PurchaseOrderItemModel[] = [];
  dataSource: MatTableDataSource<PurchaseOrderModel> = new MatTableDataSource<PurchaseOrderModel>(this.purchaseOrderList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedPurchaseOrder: PurchaseOrderModel;
  dateValue = new FormControl(moment());
  textFilterStr: string = "";

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    private dialogRef: MatDialogRef<PoSelectionDialogComponent>,
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
    this.httpRequest.getAllPurchaseOrderForIARByMonthYearWithDR(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.purchaseOrderList = result.data;
        this.dataSource = new MatTableDataSource<PurchaseOrderModel>(this.purchaseOrderList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.purchaseOrderList.length) {
          this.selectedPurchaseOrder = this.purchaseOrderList[0];
          this.itemDetails = this.purchaseOrderList[0].items;
        } else {
          this.selectedPurchaseOrder = null;
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

  rowSelected(row: PurchaseOrderModel) {
    this.selectedPurchaseOrder = row;
    this.itemDetails = row.items;
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

  public calculateTotal() {
    return this.itemDetails?.reduce((accum, curr) => accum + curr.total, 0);
  }
  
  selectPO() {
    this.dialogRef.close(
      {
        purchaseOrder: this.selectedPurchaseOrder
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
