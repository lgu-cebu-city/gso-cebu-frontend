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
import { AcceptanceAndInspectionReportItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-items-model';
import { AcceptanceAndInspectionReportModel } from 'src/app/data-model/acceptance-and-inspection-report-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { AcceptanceAndInspectionReportComponent } from '../acceptance-and-inspection-report.component';
import { Type } from 'src/app/data-model/type';
import { PrintPreviewIarComponent } from '../print-preview-iar/print-preview-iar.component';
import { IarListItemsComponent } from './iar-list-items/iar-list-items.component';
import { AcceptanceAndInspectionReportDetailedItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-detailed-items-model';

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
  selector: 'app-inspection-and-acceptance-report-list',
  templateUrl: './inspection-and-acceptance-report-list.component.html',
  styleUrls: ['./inspection-and-acceptance-report-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class InspectionAndAcceptanceReportListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['logs', 'referenceNo', 'referenceDate', 'invoiceNo', 'invoiceDate', 'poNo', 'poDate', 'departmentName', 'supplierName', 'supplierAddress', 'purpose'];
  iarList: AcceptanceAndInspectionReportModel[] = [];
  displayedColumnsItemDetails: string[] = ['description', 'brand', 'uom', 'quantity', 'receivedQuantity'];
  itemDetails: AcceptanceAndInspectionReportItemsModel[] = [];
  dataSource: MatTableDataSource<AcceptanceAndInspectionReportModel> = new MatTableDataSource<AcceptanceAndInspectionReportModel>(this.iarList);
  selectedIar: AcceptanceAndInspectionReportModel;
  selectedIarItemsPrint: AcceptanceAndInspectionReportItemsModel[][] = [];
  datepipe: DatePipe = new DatePipe('en-US');
  dateValue = new FormControl(moment());
  textFilterStr: string = "";
  module = this;
  itemTypeList: Type[];
  isLoading = false;
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
    this.commonFunction.printPreviewFn = this.printPreview;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
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
    this.httpRequest.getAllAcceptanceAndInspectionReportByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
      if (result.statusCode == 200) {
        this.iarList = result.data;
        this.iarList.forEach(_iar => {
          _iar.items.forEach(_iari => {
            var _dItems = _iar.detailedItem.filter(_iard => _iard.itemId == _iari.itemId);
            _dItems.sort((i1,i2) => {
              if (i1.remarks > i2.remarks) return 1;
              if (i1.remarks < i2.remarks) return -1;
              return 0;
            });
            _dItems.forEach(_xdItem => {
              if (_iari.detailedItem == undefined) _iari.detailedItem = [];
              _iari.detailedItem.push(new AcceptanceAndInspectionReportDetailedItemsModel(
                _xdItem.remarks,
                _xdItem.brandId,
                _xdItem.model,
                _xdItem.serialNo,
                _xdItem.subItems
              ));
            });
          });
        });
        this.dataSource = new MatTableDataSource<AcceptanceAndInspectionReportModel>(this.iarList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.iarList.length) {
          this.selectedIar = this.iarList[0];
          this.itemDetails = this.iarList[0].items;
          this.loadItemsForPrint(this.iarList[0].items);
        } else {
          this.selectedIar = null;
          this.itemDetails = [];
        }
      }
      this.isLoading = false;
    });
  }

  cloneItemsForPrint(items: AcceptanceAndInspectionReportItemsModel[]): AcceptanceAndInspectionReportItemsModel[] {
    var _retItems: AcceptanceAndInspectionReportItemsModel[] = [];

    items.forEach(_item => {
      _retItems.push(new AcceptanceAndInspectionReportItemsModel(
        _item.id,
        _item.poItemId,
        _item.groupId,
        _item.groupName,
        _item.itemId,
        _item.description,
        _item.specification,
        _item.uom,
        _item.quantity,
        _item.price,
        _item.receivedQuantity,
        _item.brand,
        _item.brandId,
        _item.expirationDate,
        _item.lotNo,
        _item.remarks,
        _item.serialNo,
        _item.model,
        _item.subItems
      ));
    });

    return _retItems;
  }

  loadItemsForPrint(_items: AcceptanceAndInspectionReportItemsModel[]) {
    var items = this.cloneItemsForPrint(_items);
    items = items.filter(item => item.quantity > 0);

    var itemsTemp: AcceptanceAndInspectionReportItemsModel[] = [];
    items.forEach(_itm => {
      itemsTemp.push(_itm);
      if (_itm.specification) {
        var _spec1 = _itm.specification.trimEnd().split("\n");
        _spec1.forEach((_txt1) => {
          var _spec = _txt1.split(" ");
          var _itemSpec_temp = "";
          var _itemSpec = "";
          _spec.forEach((_txt, indx) => {
            _itemSpec_temp += (indx == 0 ? "• " : " ") + _txt;
            if (_itemSpec_temp.length >= 35) {
              itemsTemp.push(new AcceptanceAndInspectionReportItemsModel("x", "", "", "", "", _itemSpec, "", "", 0, 0, 0, "", "", null, "", "", "", "", []));
              _itemSpec = "";
              _itemSpec_temp = _txt;
            }
            _itemSpec += (indx == 0 ? "• " : " ") + _txt;
            if (indx == _spec.length-1) {
              itemsTemp.push(new AcceptanceAndInspectionReportItemsModel("x", "", "", "", "", _itemSpec, "", "", 0, 0, 0, "", "", null, "", "", "", "", []));
            }
          });
        });
      }

      var _itemType = this.itemTypeList.find(i => i.id == _itm.groupId);
      var _serial = _itm.serialNo.split(" | ");
      var _model = _itm.model.split(" | ");
      var _brand = _itm.brand.split(" | ");

      if (_serial.length && _itemType.groupName == "Equipment") {
        for(var i = 0; i < _serial.length; i++) {
          itemsTemp.push(new AcceptanceAndInspectionReportItemsModel("x", "", "", "", "", "Model: " + _model[i], "", "", 0, 0, 0, "", "", null, "", "", "", "", []));
          itemsTemp.push(new AcceptanceAndInspectionReportItemsModel("x", "", "", "", "", "Brand: " + _brand[i], "", "", 0, 0, 0, "", "", null, "", "", "", "", []));
          itemsTemp.push(new AcceptanceAndInspectionReportItemsModel("x", "", "", "", "", "Serial: " + _serial[i], "", "", 0, 0, 0, "", "", null, "", "", "", "", []));
        }
      } else if(_itemType.isWithExpiry == "1") {
        itemsTemp.push(new AcceptanceAndInspectionReportItemsModel("x", "", "", "", "", "Brand: " + _itm.brand, "", "", 0, 0, 0, "", "", null, "", "", "", "", []));
        itemsTemp.push(new AcceptanceAndInspectionReportItemsModel("x", "", "", "", "", "Lot No: " + _itm.lotNo, "", "", 0, 0, 0, "", "", null, "", "", "", "", []));
        itemsTemp.push(new AcceptanceAndInspectionReportItemsModel("x", "", "", "", "", "Expiry Date: " + this.datepipe.transform(_itm.expirationDate, 'MMM d, yyyy'), "", "", 0, 0, 0, "", "", null, "", "", "", "", []));
      } else {
        if (_itm.subItems.length) {
          _itm.subItems.forEach((itm) => {
            itemsTemp.push(new AcceptanceAndInspectionReportItemsModel(
              "x",
              "",
              "",
              "",
              "",
              " - " + itm.description,
              "",
              "",
              0,
              0,
              0,
              "",
              "",
              null,
              "",
              "",
              "",
              "",
              []
            ));
          });
        }
      }
    });

    var ctr: number = 1;
    itemsTemp.forEach(_item => {
      if (_item.id != '0' && _item.id != 'x') {
        _item.id = ctr.toString();
        ctr += 1;
      }
    });
    
    var printItemsTemp: AcceptanceAndInspectionReportItemsModel[] = [];
    this.selectedIarItemsPrint = [];
    var len: number = this.getPrintLength(itemsTemp.length);
    for (var i = 0; i < len; i++) {
      if (itemsTemp[i]) {
        printItemsTemp.push(itemsTemp[i]);
      } else {
        var item = new AcceptanceAndInspectionReportItemsModel("", "", "", "", "", "", "", "", 0, 0, 0, "", "", null, "", "", "", "", [])
        printItemsTemp.push(item);
      }

      if (printItemsTemp.length >= 24) {
        this.selectedIarItemsPrint.push(printItemsTemp);
        printItemsTemp = [];
      }
    }
  }

  // loadItemsForPrint(_items: AcceptanceAndInspectionReportItemsModel[]) {
  //   var items = this.cloneItemsForPrint(_items);
  //   items = items.filter(item => item.quantity > 0);

  //   var typeTemp: string[] = [...new Set(items.map(item => item.groupId))];
  //   var itemsTemp: AcceptanceAndInspectionReportItemsModel[] = [];
  //   typeTemp.forEach((_type) => {
  //     itemsTemp.push(new AcceptanceAndInspectionReportItemsModel(
  //       "0",
  //       "",
  //       "",
  //       "",
  //       "",
  //       this.itemTypeList.find((type) => type.id == _type)?.description || "Unknown Item Type",
  //       "",
  //       "",
  //       0,
  //       0,
  //       0,
  //       "",
  //       "",
  //       null,
  //       "",
  //       "",
  //       "",
  //       "",
  //       []
  //     ));
  //     var _typeItem: AcceptanceAndInspectionReportItemsModel[] = items.filter(_item => _item.groupId == _type);
  //     _typeItem.forEach(_itm => {
  //       itemsTemp.push(_itm);
  //       if (_itm.specification) {
  //         itemsTemp.push(new AcceptanceAndInspectionReportItemsModel(
  //           "x",
  //           "",
  //           "",
  //           "",
  //           "",
  //           " - " + _itm.specification,
  //           "",
  //           "",
  //           0,
  //           0,
  //           0,
  //           "",
  //           "",
  //           null,
  //           "",
  //           "",
  //           "",
  //           "",
  //           []
  //         ));
  //       }
  //       if (_itm.subItems.length) {
  //         _itm.subItems.forEach((itm) => {
  //           itemsTemp.push(new AcceptanceAndInspectionReportItemsModel(
  //             "x",
  //             "",
  //             "",
  //             "",
  //             "",
  //             " - " + itm.description,
  //             "",
  //             "",
  //             0,
  //             0,
  //             0,
  //             "",
  //             "",
  //             null,
  //             "",
  //             "",
  //             "",
  //             "",
  //             []
  //           ));
  //         });
  //       }
  //     })
  //   });

  //   var ctr: number = 1;
  //   itemsTemp.forEach(_item => {
  //     if (_item.id != '0' && _item.id != 'x') {
  //       _item.id = ctr.toString();
  //       ctr += 1;
  //     }
  //   });
    
  //   var printItemsTemp: AcceptanceAndInspectionReportItemsModel[] = [];
  //   this.selectedIarItemsPrint = [];
  //   var len: number = this.getPrintLength(itemsTemp.length);
  //   for (var i = 0; i < len; i++) {
  //     if (itemsTemp[i]) {
  //       printItemsTemp.push(itemsTemp[i]);
  //     } else {
  //       var item = new AcceptanceAndInspectionReportItemsModel("", "", "", "", "", "", "", "", 0, 0, 0, "", "", null, "", "", "", "", [])
  //       printItemsTemp.push(item);
  //     }

  //     if (printItemsTemp.length >= 21) {
  //       this.selectedIarItemsPrint.push(printItemsTemp);
  //       printItemsTemp = [];
  //     }
  //   }
  // }

  getPrintLength(currLen: number): number {
    var wholePage = Math.trunc(currLen / 24) * 24;
    var rem = currLen - wholePage;
    if (rem > 0) {
      wholePage += 24;
    }

    return wholePage;
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedIar = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedIar = null;
      this.itemDetails = [];
    }
  }

  calculateTotal(): number {
    if (this.selectedIar) {
      return this.selectedIar.items?.reduce((accum, curr) => accum + (curr.price * curr.quantity), 0);
    } else {
      return 0;
    }
  }

  viewData(data: AcceptanceAndInspectionReportModel) {
    this.router.navigate(["/inspection-and-acceptance-report", { id: data.id }]);
  }

  rowSelected(row: AcceptanceAndInspectionReportModel) {
    this.selectedIar = row;
    this.itemDetails = row.items;
    this.loadItemsForPrint(row.items);
  }

  viewItems(data: AcceptanceAndInspectionReportModel) {
    const dialogRef = this.dialog.open(IarListItemsComponent, {
      data: {
        selectedData: data,
        typeList: this.itemTypeList
      },
    });
  }

  printData(index: number){
    let el: HTMLElement = this.printBtn.nativeElement;
    el.click();
    // this.selectedPo = this.poList[index];
    // this.loadItemsForPrint(this.poList[index].items);
    // setTimeout(() => 
    // {
    //   let el: HTMLElement = this.printBtn.nativeElement;
    //   el.click();
    // },
    // 500);
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
  }
  
  createFn() {
    const dialogRef = this.dialog.open(AcceptanceAndInspectionReportComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(AcceptanceAndInspectionReportComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedIar
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    this.module.httpRequest.deleteAcceptanceAndInspectionReport(this.module.selectedIar.id).subscribe((result) => {
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

  printPreview() {
    const dialogRef = this.dialog.open(PrintPreviewIarComponent, {
      data: {
        selectedIar: this.module.selectedIar,
        selectedIarItemsPrint: this.module.selectedIarItemsPrint
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.printFn();
      }
    });
  }
}
