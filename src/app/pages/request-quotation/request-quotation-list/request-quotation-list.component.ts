import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { RequestQuotationItemsModel } from 'src/app/data-model/request-quotation-items-model';
import { RequestQuotationModel } from 'src/app/data-model/requestQuotationModel';
import { Type } from 'src/app/data-model/type';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { RequestQuotationComponent } from '../request-quotation.component';
import { RfqListItemsComponent } from './rfq-list-items/rfq-list-items.component';
import { PrintPreviewRfqComponent } from '../print-preview-rfq/print-preview-rfq.component';
import { PrintPreviewCanvassSheetComponent } from '../print-preview-canvass-sheet/print-preview-canvass-sheet.component';
import { PreviewSelectionRfqComponent } from '../preview-selection-rfq/preview-selection-rfq.component';

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
  selector: 'app-request-quotation-list',
  templateUrl: './request-quotation-list.component.html',
  styleUrls: ['./request-quotation-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class RequestQuotationListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['items', 'transactionNo', 'transactionDate', 'recommendingDate', 'prNo', 'prDate', 'departmentName', 'openningDate', 'location', 'canvasserName', 'biddingType', 'approvedBudget', 'supplyDescription'];
  displayedColumnsItemDetails: string[] = ['description', 'quantity', 'uom', 'cost', 'total', 'remarks'];
  rfqList: RequestQuotationModel[] = [];
  itemDetails: RequestQuotationItemsModel[] = [];
  dataSource: MatTableDataSource<RequestQuotationModel> = new MatTableDataSource<RequestQuotationModel>(this.rfqList);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
  selectedRFQ: RequestQuotationModel;
  selectedRFQItemsPrint: RequestQuotationItemsModel[][];
  dateValue = new FormControl(moment());
  textFilterStr: string = "";
  module = this;
  itemTypeList: Type[];
  isLoading = false;

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;
  @ViewChild('printCanvassSheetButton') printCanvassSheetBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    const ctrlValue = this.dateValue.value;
    ctrlValue.year((new Date()).getFullYear());
    ctrlValue.month((new Date()).getMonth());
    this.dateValue.setValue(ctrlValue);

    this.loadItemType();
  }
  
  async ngAfterViewInit() {
    this.commonFunction.createFn = this.createFn;
    this.commonFunction.editFn = this.editFn;
    this.commonFunction.deleteFn = this.deleteFn;
    this.commonFunction.printFn = this.printFn;
    // this.commonFunction.printCanvassSheetFn = this.printCanvassSheetFn;
    this.commonFunction.printPreviewFn = this.printPreview;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
    // this.commonFunction.printCanvassSheetBtn = this.printCanvassSheetBtn;
    this.commonFunction.dialog = this.dialog;
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
    this.isLoading = true;
    this.httpRequest.getAllRequestQuotationByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.rfqList = result.data;
        this.dataSource = new MatTableDataSource<RequestQuotationModel>(this.rfqList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.rfqList.length) {
          this.selectedRFQ = this.rfqList[0];
          this.itemDetails = this.rfqList[0].items;
          this.loadItemsForPrint(this.rfqList[0].items);
        } else {
          this.selectedRFQ = null;
          this.itemDetails = [];
        }
      }
      this.isLoading = false;
    });
  }

  cloneItemsForPrint(items: RequestQuotationItemsModel[]): RequestQuotationItemsModel[] {
    var _retItems: RequestQuotationItemsModel[] = [];

    items.forEach(_item => {
      _retItems.push(new RequestQuotationItemsModel(
        _item.id,
        _item.itemId,
        _item.description,
        _item.specification,
        _item.quantity,
        _item.uom,
        _item.cost,
        _item.total,
        _item.remarks,
        _item.typeId,
      ));
    });

    return _retItems;
  }

  loadItemsForPrint(_items: RequestQuotationItemsModel[]) {
    var items = this.cloneItemsForPrint(_items);
    items = items.filter(item => item.quantity > 0);

    var itemsTemp: RequestQuotationItemsModel[] = [];
    items.forEach(_itm => {
      itemsTemp.push(_itm);
      if (_itm.specification) {
        var _spec1 = _itm.specification.split("\n");
        _spec1.forEach((_txt1) => {
          var _spec = _txt1.split(" ");
          var _itemSpec_temp = "";
          var _itemSpec = "";
          _spec.forEach((_txt, indx) => {
            _itemSpec_temp += (indx == 0 ? "• " : " ") + _txt;
            if (_itemSpec_temp.length >= 35) {
              itemsTemp.push(new RequestQuotationItemsModel("x", "", _itemSpec, "", 0, "", 0, 0, "", ""));
              _itemSpec = "";
              _itemSpec_temp = _txt;
            }
            _itemSpec += (indx == 0 ? "• " : " ") + _txt;
            if (indx == _spec.length-1) {
              itemsTemp.push(new RequestQuotationItemsModel("x", "", _itemSpec, "", 0, "", 0, 0, "", ""));
            }
          });
        });
      }
    });

    var ctr: number = 1;
    itemsTemp.forEach(_item => {
      if (_item.id != '0' && _item.id != '-' && _item.id != 'x') {
        _item.id = ctr.toString();
        ctr += 1;
      }
    });
    
    var printItemsTemp: RequestQuotationItemsModel[] = [];
    this.selectedRFQItemsPrint = [];
    var len: number = this.getPrintLength(itemsTemp.length);
    var subTotal: number = 0;
    for (var i = 0; i < len; i++) {
      if (itemsTemp[i]) {
        printItemsTemp.push(itemsTemp[i]);
        subTotal += itemsTemp[i].total;
      } else {
        var item = new RequestQuotationItemsModel("", "", "", "", 0, "", 0, 0, "", "");
        printItemsTemp.push(item);
      }

      // if (((i+1) % 14 == 0 && i != 0) && printItemsTemp[printItemsTemp.length-1].description != '') {
      //   var item = new RequestQuotationItemsModel(
      //     "-",
      //     "",
      //     "Sub-Total",
      //     "",
      //     0,
      //     "",
      //     0,
      //     subTotal,
      //     "",
      //     "",
      //   );
      //   printItemsTemp.push(item);
      //   subTotal = 0;
      // } else if (i == itemsTemp.length-1) {
      //   printItemsTemp.push(new RequestQuotationItemsModel("", "", "", "", 0, "", 0, 0, "", ""));
      // }

      if (printItemsTemp.length >= 18) {
        this.selectedRFQItemsPrint.push(printItemsTemp);
        printItemsTemp = [];
      }
    }
  }

  // loadItemsForPrint(_items: RequestQuotationItemsModel[]) {
  //   var items = this.cloneItemsForPrint(_items);
  //   items = items.filter(item => item.quantity > 0);

  //   var typeTemp: string[] = [...new Set(items.map(item => item.typeId))];
  //   var itemsTemp: RequestQuotationItemsModel[] = [];
  //   typeTemp.forEach((_type) => {
  //     itemsTemp.push(new RequestQuotationItemsModel(
  //       "0",
  //       "",
  //       this.itemTypeList.find((type) => type.id == _type)?.description || "Unknown Item Type",
  //       "",
  //       0,
  //       "",
  //       0,
  //       0,
  //       "",
  //       "",
  //     ));
  //     var _typeItem: RequestQuotationItemsModel[] = items.filter(_item => _item.typeId == _type);
  //     _typeItem.forEach(_itm => {
  //       itemsTemp.push(_itm);
  //       if (_itm.specification) {
  //         itemsTemp.push(new RequestQuotationItemsModel(
  //           "x",
  //           "",
  //           _itm.specification,
  //           "",
  //           0,
  //           "",
  //           0,
  //           0,
  //           "",
  //           "",
  //         ));
  //       }
  //     });
  //   });

  //   var ctr: number = 1;
  //   itemsTemp.forEach(_item => {
  //     if (_item.id != '0' && _item.id != '-' && _item.id != 'x') {
  //       _item.id = ctr.toString();
  //       ctr += 1;
  //     }
  //   });
    
  //   var printItemsTemp: RequestQuotationItemsModel[] = [];
  //   this.selectedRFQItemsPrint = [];
  //   var len: number = this.getPrintLength(itemsTemp.length);
  //   var subTotal: number = 0;
  //   for (var i = 0; i < len; i++) {
  //     if (itemsTemp[i]) {
  //       printItemsTemp.push(itemsTemp[i]);
  //       if (i > 0 && itemsTemp[i-1].typeId == itemsTemp[i].typeId) {
  //         subTotal += itemsTemp[i].total;
  //       } else {
  //         subTotal = 0;
  //         subTotal += itemsTemp[i].total;
  //       }
  //     } else {
  //       var item = new RequestQuotationItemsModel("", "", "", "", 0, "", 0, 0, "", "");
  //       printItemsTemp.push(item);
  //     }

  //     // NOT APPLICABLE FOR CURRENT RELEASE --- START
  //     // if (((i+1) % 25 == 0 && i != 0) && printItemsTemp[printItemsTemp.length-1].description != '') {
  //     //   var item = new RequestQuotationItemsModel(
  //     //     "-",
  //     //     "",
  //     //     "Sub-Total",
  //     //     "",
  //     //     0,
  //     //     0,
  //     //     0,
  //     //     "",
  //     //     0,
  //     //     subTotal,
  //     //     "",
  //     //   )
  //     //   printItemsTemp.push(item);
  //     //   subTotal = 0;
  //     // } else if (i == itemsTemp.length-1) {
  //     //   printItemsTemp.push(new RequestQuotationItemsModel("", "", "", "", 0, 0, 0, "", 0, 0, ""));
  //     // }
  //     // NOT APPLICABLE FOR CURRENT RELEASE --- END

  //     if (printItemsTemp.length >= 15) { // CHANGED 26 TO 25 FOR CURRENT RELEASE (HIDDEN SUB TOTAL PER PAGE)
  //       this.selectedRFQItemsPrint.push(printItemsTemp);
  //       printItemsTemp = [];
  //     }
  //   }
  // }

  getPrintLength(currLen: number): number {
    var wholePage = Math.trunc(currLen / 18) * 18;
    var rem = currLen - wholePage;
    if (rem > 0) {
      wholePage += 18;
    }

    return wholePage;
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
    this.loadItemsForPrint(row.items);
  }

  viewItems(data: RequestQuotationModel) {
    const dialogRef = this.dialog.open(RfqListItemsComponent, {
      data: {
        selectedData: data,
        typeList: this.itemTypeList
      },
    });
  }

  viewData(data: RequestQuotationModel) {
    this.router.navigate(["/request-quotation", { id: data.id }]);
  }

  printData(index: number){
    this.selectedRFQ = this.rfqList[index];
    this.loadItemsForPrint(this.rfqList[index].items);
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
  }

  public calculateTotal() {
    return this.itemDetails?.reduce((accum, curr) => accum + curr.total, 0);
  }

  createFn() {
    const dialogRef = this.dialog.open(RequestQuotationComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  isRFQAvailableForEditDelete(rfqId: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.module.httpRequest.getRequestQuotationTransactionCount(rfqId).subscribe((result) => {
        if (result.statusCode == 200) {
          if (result.data[0].count > 0) {
            return res(false);
          } else {
            return res(true);
          }
        } else {
          return rej(false);
        }
      });
    });
  }

  editFn() {
    this.module.isRFQAvailableForEditDelete(this.module.selectedRFQ.id).then((val) => {
      if (val) {
        const dialogRef = this.dialog.open(RequestQuotationComponent, {panelClass: 'custom-dialog-container', data: {
          selectedData: this.module.selectedRFQ
        }},);
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.module.loadData();
          }
        });
      } else {
        this.module.notifService.showNotification(NotificationType.error, "Selected transaction has AOQ!");
      }
    });
  }

  deleteFn() {
    this.module.isRFQAvailableForEditDelete(this.module.selectedRFQ.id).then((val) => {
      if (val) {
        this.module.httpRequest.deleteRequestQuotation(this.module.selectedRFQ.id).subscribe((result) => {
          if (result.statusCode == 200) {
            this.module.notifService.showNotification(NotificationType.success, "Successfully deleted!");
            this.module.loadData();
          } else {
            this.module.notifService.showNotification(NotificationType.error, "Delete Data Failed!");
          }
        });
      } else {
        this.module.notifService.showNotification(NotificationType.error, "Selected transaction has AOQ!");
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

  printPreview() {
    const dialogRef = this.dialog.open(PrintPreviewRfqComponent, {
      data: {
        selectedRFQ: this.module.selectedRFQ,
        selectedRFQItemsPrint: this.module.selectedRFQItemsPrint
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.printFn();
      }
    });
  }

  printPreviewOld() {
    const dialogRef = this.module.dialog.open(PreviewSelectionRfqComponent, {
      data: "Property Card",
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "RFQ") {
        const dialogRef = this.dialog.open(PrintPreviewRfqComponent, {
          data: {
            selectedRFQ: this.module.selectedRFQ,
            selectedRFQItemsPrint: this.module.selectedRFQItemsPrint
          },
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.module.printFn();
          }
        });
      } else if (result.data == "CanvassSheet") {
        const dialogRef = this.dialog.open(PrintPreviewCanvassSheetComponent, {
          data: {
            selectedRFQ: this.module.selectedRFQ,
            selectedRFQItemsPrint: this.module.selectedRFQItemsPrint
          },
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.module.printCanvassSheetFn();
          }
        });
      }
    });
  }

  printCanvassSheetFn(){
    setTimeout(() => 
    {
      let el: HTMLElement = this.printCanvassSheetBtn.nativeElement;
      el.click();
    },
    500);
  }
}
