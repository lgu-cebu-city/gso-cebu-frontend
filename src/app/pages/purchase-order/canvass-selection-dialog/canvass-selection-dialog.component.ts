import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { AbstractOfCanvassItemModel } from 'src/app/data-model/abstract-of-canvass-item-model';
import { ApprovedCanvassModel } from 'src/app/data-model/approved-canvass-model';
import { Type } from 'src/app/data-model/type';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CanvassSelectionItemsDialogComponent } from './canvass-selection-items-dialog/canvass-selection-items-dialog.component';

export interface DialogData {
  selectedData: ApprovedCanvassModel;
  typeList: Type[];
}

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
  selector: 'app-canvass-selection-dialog',
  templateUrl: './canvass-selection-dialog.component.html',
  styleUrls: ['./canvass-selection-dialog.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class CanvassSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['items', 'transactionNo', 'transactionDate', 'supplyDescription', 'status', 'supplierName', 'address', 'contactNumber'];
  displayedColumnsItemDetails: string[] = ['description', 'uom', 'quantity', 'price', 'total'];
  approvedCanvassList: ApprovedCanvassModel[] = [];
  itemDetails: AbstractOfCanvassItemModel[] = [];
  dataSource: MatTableDataSource<ApprovedCanvassModel> = new MatTableDataSource<ApprovedCanvassModel>(this.approvedCanvassList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedApprovedCanvass: ApprovedCanvassModel;
  dateValue = new FormControl(moment());
  textFilterStr: string = "";
  itemTypeList: Type[];

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    private dialogRef: MatDialogRef<CanvassSelectionDialogComponent>,
    public dialog: MatDialog,
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

    this.loadItemType();
    this.loadData();
  }

  loadItemType() {
    this.httpRequest.getItemType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.itemTypeList = result.data;
      }
    });
  }

  loadData() {
    this.textFilterStr = "";
    this.httpRequest.getAllApprovedAbstractOfCanvassForPOByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.approvedCanvassList = result.data;
        this.dataSource = new MatTableDataSource<ApprovedCanvassModel>(this.approvedCanvassList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.approvedCanvassList.length) {
          this.selectedApprovedCanvass = this.approvedCanvassList[0];
          this.itemDetails = this.approvedCanvassList[0].items;
        } else {
          this.selectedApprovedCanvass = null;
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

  rowSelected(row: ApprovedCanvassModel) {
    this.selectedApprovedCanvass = row;
    this.itemDetails = row.items;
  }

  viewItems(data: ApprovedCanvassModel) {
    const dialogRef = this.dialog.open(CanvassSelectionItemsDialogComponent, {
      data: {
        selectedData: data,
        typeList: this.itemTypeList
      },
    });
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
    return this.itemDetails?.reduce((accum, curr) => accum + (curr.price * curr.quantity), 0);
  }
  
  selectRFQ() {
    this.dialogRef.close(
      {
        approvedCanvass: this.selectedApprovedCanvass
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
