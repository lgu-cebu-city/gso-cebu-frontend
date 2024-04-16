import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InventoryCustodianSlipItemsModel } from 'src/app/data-model/inventory-custodian-slip-items-model';
import { InventoryCustodianSlipModel } from 'src/app/data-model/inventory-custodian-slip-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { InventoryCustodianSlipComponent } from '../inventory-custodian-slip.component';
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
  selector: 'app-inventory-custodian-slip-list',
  templateUrl: './inventory-custodian-slip-list.component.html',
  styleUrls: ['./inventory-custodian-slip-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class InventoryCustodianSlipListComponent implements OnInit {
  displayedColumns: string[] = ['icsNo','icsDate','departmentName','fundCluster','accountType','prNo','poNo','location','supplierName','deliveryDate','remarks','receivedFromName','receivedByName', 'action'];
  areList: InventoryCustodianSlipModel[] = [];
  displayedColumnsItemDetails: string[] = ['quantity', 'uom', 'price', 'totalCost', 'description', 'propertyNo', 'serialNo', 'remarks'];
  itemDetails: InventoryCustodianSlipItemsModel[] = [];
  dataSource: MatTableDataSource<InventoryCustodianSlipModel> = new MatTableDataSource<InventoryCustodianSlipModel>(this.areList);
  selectedIcs: InventoryCustodianSlipModel;
  selectedIcsItemsPrint: InventoryCustodianSlipItemsModel[] = [];
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
    this.httpRequest.getAllInventoryCustodianSlipByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.areList = result.data;
        this.dataSource = new MatTableDataSource<InventoryCustodianSlipModel>(this.areList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.areList.length) {
          this.selectedIcs = this.areList[0];
          this.itemDetails = this.areList[0].items;
          this.loadItemsForPrint(this.areList[0].items);
        } else {
          this.itemDetails = [];
        }
      }
    });
  }

  loadItemsForPrint(items: InventoryCustodianSlipItemsModel[]) {
    this.selectedIcsItemsPrint = [];
    var maxIndex: number = items.length < 15 ? 15 : items.length;
    for (var i = 0; i < maxIndex; i++) {
      var item: InventoryCustodianSlipItemsModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new InventoryCustodianSlipItemsModel(
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
        item = new InventoryCustodianSlipItemsModel(
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
      this.selectedIcsItemsPrint.push(item);
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
      this.selectedIcs = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedIcs = null;
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

  viewData(data: InventoryCustodianSlipModel) {
    this.router.navigate(["/inventory-custodian-slip", { id: data.id }]);
  }

  rowSelected(row: InventoryCustodianSlipModel) {
    this.selectedIcs = row;
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
    const dialogRef = this.dialog.open(InventoryCustodianSlipComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(InventoryCustodianSlipComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedIcs
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    this.module.httpRequest.deleteInventoryCustodianSlip(this.module.selectedIcs.id).subscribe((result) => {
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
