import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PreRepairInspectionItemsModel } from 'src/app/data-model/pre-repair-inspection-items-model';
import { PreRepairInspectionModel } from 'src/app/data-model/pre-repair-inspection-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { PreRepairInspectionComponent } from '../pre-repair-inspection.component';
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
  selector: 'app-pre-repair-inspection-list',
  templateUrl: './pre-repair-inspection-list.component.html',
  styleUrls: ['./pre-repair-inspection-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PreRepairInspectionListComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo','transactionDate','vehicleName','vehicleType','plateNo','brandModel','engineNo','chassisNo','acquisationDate','acquisationCost','lastRepairDate','lastRepairNature','defectComplaints','workScope','requestedByName','inspectedBy1Name','inspectedBy2Name','notedByName'];
  priList: PreRepairInspectionModel[] = [];
  displayedColumnsItemDetails: string[] = ['description', 'uom', 'quantity'];
  itemDetails: PreRepairInspectionItemsModel[] = [];
  dataSource: MatTableDataSource<PreRepairInspectionModel> = new MatTableDataSource<PreRepairInspectionModel>(this.priList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  selectedPri: PreRepairInspectionModel;
  selectedPriItemsPrint: PreRepairInspectionItemsModel[] = [];
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
    this.httpRequest.getAllPreRepairInspectionByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.priList = result.data;
        this.dataSource = new MatTableDataSource<PreRepairInspectionModel>(this.priList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.priList.length) {
          this.selectedPri = this.priList[0];
          this.itemDetails = this.priList[0].items;
          this.loadItemsForPrint(this.priList[0].items);
        } else {
          this.itemDetails = [];
        }
      }
    });
  }

  loadItemsForPrint(items: PreRepairInspectionItemsModel[]) {
    // this.selectedPriItemsPrint = [];
    // var maxIndex: number = items.length < 5 ? 5 : items.length;
    // for (var i = 0; i < maxIndex; i++) {
    //   var item: PreRepairInspectionItemsModel;
    //   if (items[i]) {
    //     item = items[i];
    //   } else if (i == items.length) {
    //     item = new PreRepairInspectionItemsModel(
    //       "",
    //       "",
    //       "***Nothing Follows***",
    //       "",
    //       0,
    //       0,
    //       0,
    //       "",
    //     );
    //   } else {
    //     item = new PreRepairInspectionItemsModel(
    //       "",
    //       "",
    //       "",
    //       "",
    //       0,
    //       0,
    //       0,
    //       "",
    //     );
    //   }
    //   this.selectedPriItemsPrint.push(item);
    // }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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

  rowSelected(row: PreRepairInspectionModel) {
    this.selectedPri = row;
    this.itemDetails = row.items;
    this.loadItemsForPrint(row.items);
  }

  viewData(data: any) {
    this.router.navigate(["/pre-repair-inspection", { id: data.id }]);
  }

  printData(index: number){
    this.selectedPri = this.priList[index];
    this.loadItemsForPrint(this.priList[index].items);
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
    const dialogRef = this.dialog.open(PreRepairInspectionComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(PreRepairInspectionComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedPri
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    this.module.httpRequest.deletePreRepairInspection(this.module.selectedPri.id).subscribe((result) => {
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
