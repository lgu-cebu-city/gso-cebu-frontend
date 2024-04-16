import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { WasteMaterialReportItemModel } from 'src/app/data-model/waste-material-report-item-model';
import { WasteMaterialReportModel } from 'src/app/data-model/waste-material-report-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { WasteMaterialReportComponent } from '../waste-material-report.component';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';

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
  selector: 'app-waste-material-report-list',
  templateUrl: './waste-material-report-list.component.html',
  styleUrls: ['./waste-material-report-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class WasteMaterialReportListComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'placeOfStorage', 'departmentName', 'action'];
  wmrList: WasteMaterialReportModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'quantity', 'description', 'orNo', 'orDate'];
  itemDetails: WasteMaterialReportItemModel[] = [];
  dataSource: MatTableDataSource<WasteMaterialReportModel> = new MatTableDataSource<WasteMaterialReportModel>(this.wmrList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  selectedWMR: WasteMaterialReportModel;
  selectedWMRItemsPrint: WasteMaterialReportItemModel[] = [];
  dateValue = new FormControl(moment());
  module = this;

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    private notifService : NotificationService,
    public commonFunction: CommonFunctionService,
    public dialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.commonFunction.createFn = this.createFn;
    this.commonFunction.editFn = this.editFn;
    this.commonFunction.deleteFn = this.deleteFn;
    this.commonFunction.printFn = this.printFn;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
    this.commonFunction.dialog = this.dialog;
  }

  loadData() {
    this.httpRequest.getAllWasteMaterialReportByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.wmrList = result.data;
        this.dataSource = new MatTableDataSource<WasteMaterialReportModel>(this.wmrList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.wmrList.length) {
          this.selectedWMR = this.wmrList[0];
          this.itemDetails = this.wmrList[0]?.items;
          this.loadItemsForPrint(this.wmrList[0].items);
        } else {
          this.itemDetails = [];
        }
      }
    });
  }

  loadItemsForPrint(items: WasteMaterialReportItemModel[]) {
    this.selectedWMRItemsPrint = [];
    var maxIndex: number = items.length < 8 ? 8 : items.length;
    for (var i = 0; i < maxIndex; i++) {
      var item: WasteMaterialReportItemModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new WasteMaterialReportItemModel(
          "",
          "",
          0,
          "",
          "***Nothing Follows***",
          "",
          "",
          "",
          "",
          "",
          null,
          0,
          null,
        );
      } else {
        item = new WasteMaterialReportItemModel(
          "",
          "",
          0,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          null,
          0,
          null,
        );
      }
      this.selectedWMRItemsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedWMR = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedWMR = null;
      this.itemDetails = [];
    }
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

  rowSelected(row: WasteMaterialReportModel) {
    this.selectedWMR = row;
    this.itemDetails = row.items;
    this.loadItemsForPrint(row.items);
  }

  viewData(data: any) {
    this.router.navigate(["/waste-material-report", { id: data.id }]);
  }

  printData(index: number){
    this.selectedWMR = this.wmrList[index];
    this.loadItemsForPrint(this.wmrList[index].items);
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

  createFn() {
    const dialogRef = this.dialog.open(WasteMaterialReportComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(WasteMaterialReportComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedWMR
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    this.module.httpRequest.deleteWasteMaterialReport(this.module.selectedWMR.id).subscribe((result) => {
      if (result.statusCode == 200) {
        this.module.notifService.showNotification(NotificationType.success, "Successfully Deleted!");
        this.module.loadData();
      } else {
        this.module.notifService.showNotification(NotificationType.error, "Delete Data Failed!");
      }
    });
  }

  printFn(){
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }
}
