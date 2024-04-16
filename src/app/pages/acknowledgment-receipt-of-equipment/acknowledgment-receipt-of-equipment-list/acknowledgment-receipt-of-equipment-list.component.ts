import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AcknowledgementReceiptItemsModel } from 'src/app/data-model/acknowledgment-receipt-items-model';
import { AcknowledgementReceiptModel } from 'src/app/data-model/acknowledgment-receipt-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { AcknowledgmentReceiptOfEquipmentComponent } from '../acknowledgment-receipt-of-equipment.component';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { NotificationType } from 'src/app/util/notification_type';
import { NotificationService } from 'src/app/services/notification.service';

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
  selector: 'app-acknowledgment-receipt-of-equipment-list',
  templateUrl: './acknowledgment-receipt-of-equipment-list.component.html',
  styleUrls: ['./acknowledgment-receipt-of-equipment-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AcknowledgmentReceiptOfEquipmentListComponent implements OnInit {
  displayedColumns: string[] = ['parNo','parDate','departmentName','fundCluster','accountType','prNo','poNo','location','supplierName','deliveryDate','remarks','receivedByName','issuedByName'];
  areList: AcknowledgementReceiptModel[] = [];
  displayedColumnsItemDetails: string[] = ['quantity','uom','description','propertyNo','price','brand','serialNo','model'];
  itemDetails: AcknowledgementReceiptItemsModel[] = [];
  dataSource: MatTableDataSource<AcknowledgementReceiptModel> = new MatTableDataSource<AcknowledgementReceiptModel>(this.areList);
  selectedAre: AcknowledgementReceiptModel;
  selectedAreItemsPrint: AcknowledgementReceiptItemsModel[] = [];
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
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
    this.httpRequest.getAllAcknowledgmentReceiptOfEquipmentByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.areList = result.data;
        this.dataSource = new MatTableDataSource<AcknowledgementReceiptModel>(this.areList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.areList.length) {
          this.selectedAre = this.areList[0];
          this.itemDetails = this.areList[0].items;
          this.loadItemsForPrint(this.areList[0].items);
        } else {
          this.itemDetails = [];
        }
      }
    });
  }

  loadItemsForPrint(items: AcknowledgementReceiptItemsModel[]) {
    this.selectedAreItemsPrint = [];
    var maxIndex: number = items.length < 15 ? 15 : items.length;
    for (var i = 0; i < maxIndex; i++) {
      var item: AcknowledgementReceiptItemsModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new AcknowledgementReceiptItemsModel(
          "",
          "",
          "",
          "",
          "",
          "",
          "***Nothing Follows***",
          "",
          0,
          0,
          null,
          0,
          "",
          "",
          null,
          "",
          "",
          "",
          "",
          "",
          "",
          []
        );
      } else {
        item = new AcknowledgementReceiptItemsModel(
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          0,
          0,
          null,
          0,
          "",
          "",
          null,
          "",
          "",
          "",
          "",
          "",
          "",
          []
        );
      }
      this.selectedAreItemsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedAre = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedAre = null;
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

  viewData(data: AcknowledgementReceiptModel) {
    this.router.navigate(["/acknowledgment-receipt-of-equipment", { id: data.id }]);
  }

  rowSelected(row: AcknowledgementReceiptModel) {
    this.selectedAre = row;
    this.itemDetails = row.items;
    this.loadItemsForPrint(row.items);
  }

  printData(index: number){
    let el: HTMLElement = this.printBtn.nativeElement;
    el.click();
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
  
  createFn() {
    const dialogRef = this.dialog.open(AcknowledgmentReceiptOfEquipmentComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(AcknowledgmentReceiptOfEquipmentComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedAre
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    this.module.httpRequest.deleteAcknowledgmentReceiptOfEquipment(this.module.selectedAre.id).subscribe((result) => {
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
