import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { DeliverySummaryModel } from 'src/app/data-model/delivery-summary-mode';
import { PurchaseOrderItemModel } from 'src/app/data-model/purchase-order-item-model';
import { PurchaseOrderModel } from 'src/app/data-model/purchase-order-model';
import { AuthService } from 'src/app/services/auth.service';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';

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
  selector: 'app-delivery-report',
  templateUrl: './delivery-report.component.html',
  styleUrls: ['./delivery-report.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'unset' })),
      transition('expanded <=> collapsed', 
        animate('0ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DeliveryReportComponent implements OnInit {
  env = environment;
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'canvassNo', 'prNo', 'procurementMode', 'supplierName', 'supplierAddress', 'supplierContactNo', 'deliveryPlace', 'deliveryDate', 'deliveryTerm', 'paymentTerm', 'status'];
  poList: PurchaseOrderModel[] = [];
  displayedColumnsItemDetails: string[] = ['isExpanded', 'description', 'uom', 'quantity', 'recQty', 'bal'];
  displayedColumnsItemDRDetails: string[] = ['referenceNo','referenceDate','invoiceNo','invoiceDate','receivedQuantity','balance'];
  itemDetails: PurchaseOrderItemModel[] = [];
  dataSource: MatTableDataSource<PurchaseOrderModel> = new MatTableDataSource<PurchaseOrderModel>(this.poList);
  selectedPo: PurchaseOrderModel;
  deliverySummary: DeliverySummaryModel[];
  datepipe: DatePipe = new DatePipe('en-US');
  dateValue = new FormControl(moment());
  textFilterStr: string = "";
  filterStatus: string = "All";
  module = this;

  constructor(
    public authService: AuthService,
    private httpRequest: HttpRequestService,
    public commonFunction: CommonFunctionService,
    public router: Router
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;
  @ViewChild('printSummaryButton') printSummaryBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    const ctrlValue = this.dateValue.value;
    ctrlValue.year((new Date()).getFullYear());
    ctrlValue.month((new Date()).getMonth());
    this.dateValue.setValue(ctrlValue);

    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
    this.commonFunction.printSummaryBtn = this.printSummaryBtn;
    this.commonFunction.printFn = this.printReport;
    this.commonFunction.printSummaryFn = this.printReportSummary;
  }

  loadData() {
    this.textFilterStr = "";
    this.httpRequest.getAllPurchaseOrderByMonthYearWithDR(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.poList = this.generatePoStatus(result.data);
        this.dataSource = new MatTableDataSource<PurchaseOrderModel>(this.poList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.poList.length) {
          this.selectedPo = this.poList[0];
          this.itemDetails = this.poList[0].items;
        } else {
          this.selectedPo = null;
          this.itemDetails = [];
        }
        this.generateDeliverySummary(this.dataSource.data);
      }
    });
  }

  generateDeliverySummary(listPo: PurchaseOrderModel[]) {
    this.deliverySummary = [];
    var delSummInfo: DeliverySummaryModel;

    listPo.forEach(po => {
      po.items.forEach(poItem => {
        poItem.drActual.forEach(drActual => {
          delSummInfo = new DeliverySummaryModel(
            po.transactionNo,
            po.transactionDate,
            po.canvassNo,
            po.prNo,
            po.supplierName,
            po.supplierContactNo,
            drActual.invoiceNo,
            drActual.invoiceDate,
            po.deliveryTerm,
            poItem.description,
            poItem.uom,
            poItem.quantity,
            drActual.receivedQuantity,
            drActual.balance,
            ""
          );
          this.deliverySummary.push(delSummInfo);
        });
      });
    });
  }

  getIARQty(item: PurchaseOrderItemModel) {
    var retVal: number = 0;
    
    if (item.drActual.length) {
      retVal = item.drActual.reduce((accum, curr) => accum + curr.receivedQuantity, 0);
    }

    return retVal;
  }
  
  getBalanceQty(item: PurchaseOrderItemModel) {
    var retVal: number = item.quantity;
    
    if (item.drActual.length) {
      retVal = item.drActual[item.drActual.length-1].balance;
    }

    return retVal;
  }

  generatePoStatus(_listPo: PurchaseOrderModel[]): PurchaseOrderModel[] {
    var tempPo: PurchaseOrderModel[] = [];

    _listPo.forEach(_po => {
      if (_po.items.filter(poItems => poItems.drActual.length != 0).length == 0) {
        _po.poStatus = "Pending";
      } else {
        var hasPartial: boolean = false;
        _po.items.forEach(poItem => {
          if (poItem.drActual[poItem.drActual.length-1]?.balance != 0) {
            hasPartial = true;
          }
        });

        _po.poStatus = hasPartial ? "Partial" : "Full"
      }

      tempPo.push(_po);
    });

    return tempPo;
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  statusSelectionChanged(event: MatSelectChange) {
    this.textFilterStr = "";
    var tempPo: PurchaseOrderModel[] = [];

    switch (this.filterStatus) {
      case "Pending":
      case "Partial":
      case "Full":
        tempPo = this.poList.filter(_po => _po.poStatus == this.filterStatus);
        break;
      default:
        tempPo = this.poList;
        break;
    }

    this.dataSource = new MatTableDataSource<PurchaseOrderModel>(tempPo);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.data.length) {
      this.selectedPo = this.dataSource.data[0];
      this.itemDetails = this.dataSource.data[0].items;
    } else {
      this.selectedPo = null;
      this.itemDetails = [];
    }
    this.generateDeliverySummary(this.dataSource.data);
  }

  rowSelected(row: PurchaseOrderModel) {
    this.selectedPo = row;
    this.itemDetails = row.items;
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  formatNumber(value: number): string {
    return Number(value).toFixed(2);
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

  printReport(){
    this.module.selectedPo = this.module.selectedPo;
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  printReportSummary(){
    setTimeout(() => 
    {
      let el: HTMLElement = this.printSummaryBtn.nativeElement;
      el.click();
    },
    500);
  }
}
