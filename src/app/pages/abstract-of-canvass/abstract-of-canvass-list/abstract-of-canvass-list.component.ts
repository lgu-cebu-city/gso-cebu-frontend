import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { AbstractOfCanvassItemModel } from 'src/app/data-model/abstract-of-canvass-item-model';
import { AbstractOfCanvassModel } from 'src/app/data-model/abstract-of-canvass-model';
import { ProjectProposalItemsModel } from 'src/app/data-model/project-proposal-items-model';
import { RequestQuotationItemsModel } from 'src/app/data-model/request-quotation-items-model';
import { TransactionModel } from 'src/app/data-model/transaction-model';
import { Type } from 'src/app/data-model/type';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { AbstractOfCanvassComponent } from '../abstract-of-canvass.component';
import { AwardDialogComponent } from './award-dialog/award-dialog.component';
import { PrintPreviewAocComponent } from '../print-preview-aoc/print-preview-aoc.component';
import { RequestQuotationModel } from 'src/app/data-model/requestQuotationModel';
import { PrintPreviewAobComponent } from '../print-preview-aob/print-preview-aob.component';
import { AbstractOfCanvassSupplierModel } from 'src/app/data-model/abstract-of-canvass-supplier-model';

export interface SupplierItems {
  itemId: string,
  description: string,
  specification: string,
  uom: string,
  quantity: number,
  price: number,
  typeId: string,
  supplier1Selected: boolean,
  supplier1Id: string,
  supplier1Name: string,
  supplier1Qty: number,
  supplier1Price: number,
  supplier2Selected: boolean,
  supplier2Id: string,
  supplier2Name: string,
  supplier2Qty: number,
  supplier2Price: number,
  supplier3Selected: boolean,
  supplier3Id: string,
  supplier3Name: string,
  supplier3Qty: number,
  supplier3Price: number,
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

export interface DialogData {
  abstractOfCanvass: AbstractOfCanvassModel;
  action: string;
}

@Component({
  selector: 'app-abstract-of-canvass-list',
  templateUrl: './abstract-of-canvass-list.component.html',
  styleUrls: ['./abstract-of-canvass-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AbstractOfCanvassListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['action', 'transactionNo', 'transactionDate', 'rfqNo', 'supplyDescription', 'remarks'];
  dataSource: MatTableDataSource<AbstractOfCanvassModel> = new MatTableDataSource<AbstractOfCanvassModel>([]);
  datepipe: DatePipe = new DatePipe('en-US');
  selectedAOC: AbstractOfCanvassModel;
  selectedRFQ: RequestQuotationModel;
  aocData: SupplierItems[] = [];
  aocPrintData: SupplierItems[][] = [];
  transData: TransactionModel;
  contextMenuPosition = { x: '0px', y: '0px' };
  dateValue = new FormControl(moment());
  textFilterStr: string = "";
  module = this;
  itemTypeList: Type[];
  itemsTotalAmt: number = 0;
  isLoading = false;

  printItemsData: ProjectProposalItemsModel[] = [];
  printDataSupp1: AbstractOfCanvassItemModel[] = [];
  printDataSupp2: AbstractOfCanvassItemModel[] = [];
  printDataSupp3: AbstractOfCanvassItemModel[] = [];

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    private notifService : NotificationService,
    public dialog: MatDialog,
    public commonFunction: CommonFunctionService,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild('printAwardButton') printAwardBtn: ElementRef<HTMLElement>;
  @ViewChild('printAOCButton') printBtn: ElementRef<HTMLElement>;
  @ViewChild('printAOBButton') printBtnAOB: ElementRef<HTMLElement>;

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
    this.httpRequest.getAllAbstractOfCanvassByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe(async (result) => {
      if (result.statusCode == 200) {
        this.dataSource = new MatTableDataSource<AbstractOfCanvassModel>(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (result.data.length) {
          this.selectedAOC = this.dataSource.data[0];
          this.loadItemsForPrint();
          await this.getProjectData(this.selectedAOC.id);
        } else {
          this.selectedAOC = null;
        }
      }
      this.isLoading = false;
    });
  }

  sortSupplier(_oSupp: AbstractOfCanvassSupplierModel[]): AbstractOfCanvassSupplierModel[] {
    var _nSupp: AbstractOfCanvassSupplierModel[] = [];
    var _lSupp: {s: string, a: number}[] = [];

    _oSupp.forEach(_s => {
      _lSupp.push({s: _s.id, a: _s.items?.reduce((accum, curr) => accum + curr.priceCalculated, 0)});
    });

    _lSupp.sort((a, b) => {
      return a.a - b.a;
    });

    _nSupp.push(... _oSupp.filter(_os => _os.approved == true));

    _lSupp.forEach(_s => {
      if (!_nSupp.find(_os => _os.id == _s.s)) {
        _nSupp.push(_oSupp.find(_os => _os.id == _s.s));
      }
    });

    return _nSupp;
  }

  loadItemsForPrint() {
    var rfqID = this.module.selectedAOC.rfqId;
    this.module.selectedAOC.supplier = this.sortSupplier(this.module.selectedAOC.supplier);
    this.module.httpRequest.getRequestQuotationById(rfqID).subscribe((result) => {
      if (result.statusCode == 200) {
        this.module.aocData = [];
        this.module.itemsTotalAmt = 0;
        this.selectedRFQ = result.data;
        var _rfqItems: RequestQuotationItemsModel[] = this.selectedRFQ.items;
        
        _rfqItems.forEach(_item => {
          if (_item.quantity > 0) {
            var _itemTemp: SupplierItems = {
              itemId: "",
              description: "",
              specification: "",
              uom: "",
              quantity: 0,
              price: 0,
              typeId: "",
              supplier1Selected: false,
              supplier1Id: "",
              supplier1Name: "",
              supplier1Qty: 0,
              supplier1Price: 0,
              supplier2Selected: false,
              supplier2Id: "",
              supplier2Name: "",
              supplier2Qty: 0,
              supplier2Price: 0,
              supplier3Selected: false,
              supplier3Id: "",
              supplier3Name: "",
              supplier3Qty: 0,
              supplier3Price: 0,
            };

            this.module.itemsTotalAmt += _item.total;
  
            _itemTemp.itemId = _item.itemId;
            _itemTemp.description = _item.description;
            _itemTemp.specification = _item.specification;
            _itemTemp.uom = _item.uom;
            _itemTemp.quantity = _item.quantity;
            _itemTemp.price = _item.cost;
            _itemTemp.typeId = _item.typeId;
  
            if (this.module.selectedAOC.supplier[0]) {
              var _supp1Item: AbstractOfCanvassItemModel = this.module.selectedAOC.supplier[0].items.find(_suppItem => _suppItem.itemId == _item.itemId);
              _itemTemp.supplier1Id = this.module.selectedAOC.supplier[0].supplierId;
              _itemTemp.supplier1Name = this.module.selectedAOC.supplier[0].supplierName;
              _itemTemp.supplier1Qty = _supp1Item.quantity;
              _itemTemp.supplier1Price = _supp1Item.priceRead;
              _itemTemp.supplier1Selected = _supp1Item.awarded;
            }
  
            if (this.module.selectedAOC.supplier[1]) {
              var _supp2Item: AbstractOfCanvassItemModel = this.module.selectedAOC.supplier[1].items.find(_suppItem => _suppItem.itemId == _item.itemId);
              _itemTemp.supplier2Id = this.module.selectedAOC.supplier[1].supplierId;
              _itemTemp.supplier2Name = this.module.selectedAOC.supplier[1].supplierName;
              _itemTemp.supplier2Qty = _supp2Item.quantity;
              _itemTemp.supplier2Price = _supp2Item.priceRead;
              _itemTemp.supplier2Selected = _supp2Item.awarded;
            }
  
            if (this.module.selectedAOC.supplier[2]) {
              var _supp3Item: AbstractOfCanvassItemModel = this.module.selectedAOC.supplier[2].items.find(_suppItem => _suppItem.itemId == _item.itemId);
              _itemTemp.supplier3Id = this.module.selectedAOC.supplier[2].supplierId;
              _itemTemp.supplier3Name = this.module.selectedAOC.supplier[2].supplierName;
              _itemTemp.supplier3Qty = _supp3Item.quantity;
              _itemTemp.supplier3Price = _supp3Item.priceRead;
              _itemTemp.supplier3Selected = _supp3Item.awarded;
            }
  
            this.module.aocData.push(_itemTemp);
          }
        });

        this.module.formatItemsPrint(this.module.aocData);
      }
    });
  }

  formatItemsPrint(items: SupplierItems[]) {
    items = items.filter(item => item.quantity > 0);

    var itemsTemp: SupplierItems[] = [];
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
              itemsTemp.push({
                itemId: "x",
                description: _itemSpec,
                specification: "",
                uom: "",
                quantity: 0,
                price: 0,
                typeId: "",
                supplier1Selected: false,
                supplier1Id: "",
                supplier1Name: "",
                supplier1Qty: 0,
                supplier1Price: 0,
                supplier2Selected: false,
                supplier2Id: "",
                supplier2Name: "",
                supplier2Qty: 0,
                supplier2Price: 0,
                supplier3Selected: false,
                supplier3Id: "",
                supplier3Name: "",
                supplier3Qty: 0,
                supplier3Price: 0,
              });
              _itemSpec = "";
              _itemSpec_temp = _txt;
            }
            _itemSpec += (indx == 0 ? "• " : " ") + _txt;
            if (indx == _spec.length-1) {
              itemsTemp.push({
                itemId: "x",
                description: _itemSpec,
                specification: "",
                uom: "",
                quantity: 0,
                price: 0,
                typeId: "",
                supplier1Selected: false,
                supplier1Id: "",
                supplier1Name: "",
                supplier1Qty: 0,
                supplier1Price: 0,
                supplier2Selected: false,
                supplier2Id: "",
                supplier2Name: "",
                supplier2Qty: 0,
                supplier2Price: 0,
                supplier3Selected: false,
                supplier3Id: "",
                supplier3Name: "",
                supplier3Qty: 0,
                supplier3Price: 0,
              });
            }
          });
        });
      }
    });

    var ctr: number = 1;
    itemsTemp.forEach(_item => {
      if (_item.itemId != '' && _item.itemId != '-' && _item.itemId != 'x') {
        _item.itemId = ctr.toString();
        ctr += 1;
      }
    });
    
    var printItemsTemp: SupplierItems[] = [];
    this.module.aocPrintData = [];
    var len: number = this.getPrintLength(itemsTemp.length);
    var subTotalSupp1: number = 0;
    var subTotalSupp2: number = 0;
    var subTotalSupp3: number = 0;
    for (var i = 0; i < len; i++) {
      if (itemsTemp[i]) {
        printItemsTemp.push(itemsTemp[i]);
        subTotalSupp1 += itemsTemp[i].supplier1Price * itemsTemp[i].supplier1Qty;
        subTotalSupp2 += itemsTemp[i].supplier2Price * itemsTemp[i].supplier2Qty;
        subTotalSupp3 += itemsTemp[i].supplier3Price * itemsTemp[i].supplier3Qty;
      } else {
        printItemsTemp.push({
          itemId: "-",
          description: "",
          specification: "",
          uom: "",
          quantity: 0,
          price: 0,
          typeId: "",
          supplier1Selected: false,
          supplier1Id: "",
          supplier1Name: "",
          supplier1Qty: 0,
          supplier1Price: 0,
          supplier2Selected: false,
          supplier2Id: "",
          supplier2Name: "",
          supplier2Qty: 0,
          supplier2Price: 0,
          supplier3Selected: false,
          supplier3Id: "",
          supplier3Name: "",
          supplier3Qty: 0,
          supplier3Price: 0,
        });
      }

      if (((i+1) % 19 == 0 && i != 0) && printItemsTemp[printItemsTemp.length-1].description != '') {
        var item = {
          itemId: "-",
          description: "Sub-Total",
          specification: "",
          uom: "",
          quantity: 0,
          price: 0,
          typeId: "",
          supplier1Selected: false,
          supplier1Id: "",
          supplier1Name: "",
          supplier1Qty: 0,
          supplier1Price: subTotalSupp1,
          supplier2Selected: false,
          supplier2Id: "",
          supplier2Name: "",
          supplier2Qty: 0,
          supplier2Price: subTotalSupp2,
          supplier3Selected: false,
          supplier3Id: "",
          supplier3Name: "",
          supplier3Qty: 0,
          supplier3Price: subTotalSupp3,
        };
        printItemsTemp.push(item);
        subTotalSupp1 = 0;
        subTotalSupp2 = 0;
        subTotalSupp3 = 0;
      } else if (i == itemsTemp.length-1) {
        printItemsTemp.push({
          itemId: "-",
          description: "",
          specification: "",
          uom: "",
          quantity: 0,
          price: 0,
          typeId: "",
          supplier1Selected: false,
          supplier1Id: "",
          supplier1Name: "",
          supplier1Qty: 0,
          supplier1Price: 0,
          supplier2Selected: false,
          supplier2Id: "",
          supplier2Name: "",
          supplier2Qty: 0,
          supplier2Price: 0,
          supplier3Selected: false,
          supplier3Id: "",
          supplier3Name: "",
          supplier3Qty: 0,
          supplier3Price: 0,
        });
      }

      if (printItemsTemp.length >= 20) { // CHANGED 26 TO 25 FOR CURRENT RELEASE (HIDDEN SUB TOTAL PER PAGE)
        this.module.aocPrintData.push(printItemsTemp);
        printItemsTemp = [];
      }
    }
  }

  // formatItemsPrint(items: SupplierItems[]) {
  //   items = items.filter(item => item.quantity > 0);

  //   var typeTemp: string[] = [...new Set(items.map(item => item.typeId))];
  //   var itemsTemp: SupplierItems[] = [];
  //   typeTemp.forEach((_type) => {
  //     itemsTemp.push({
  //       itemId: "",
  //       description: this.module.itemTypeList.find((type) => type.id == _type)?.description || "Unknown Item Type",
  //       specification: "",
  //       uom: "",
  //       quantity: 0,
  //       price: 0,
  //       typeId: "",
  //       supplier1Selected: false,
  //       supplier1Id: "",
  //       supplier1Name: "",
  //       supplier1Qty: 0,
  //       supplier1Price: 0,
  //       supplier2Selected: false,
  //       supplier2Id: "",
  //       supplier2Name: "",
  //       supplier2Qty: 0,
  //       supplier2Price: 0,
  //       supplier3Selected: false,
  //       supplier3Id: "",
  //       supplier3Name: "",
  //       supplier3Qty: 0,
  //       supplier3Price: 0,
  //     });

  //     var _typeItem: SupplierItems[] = items.filter(_item => _item.typeId == _type);
  //     _typeItem.forEach(_itm => {
  //       itemsTemp.push(_itm);
  //       if (_itm.specification) {
  //         itemsTemp.push({
  //           itemId: "x",
  //           description: _itm.specification,
  //           specification: "",
  //           uom: "",
  //           quantity: 0,
  //           price: 0,
  //           typeId: "",
  //           supplier1Selected: false,
  //           supplier1Id: "",
  //           supplier1Name: "",
  //           supplier1Qty: 0,
  //           supplier1Price: 0,
  //           supplier2Selected: false,
  //           supplier2Id: "",
  //           supplier2Name: "",
  //           supplier2Qty: 0,
  //           supplier2Price: 0,
  //           supplier3Selected: false,
  //           supplier3Id: "",
  //           supplier3Name: "",
  //           supplier3Qty: 0,
  //           supplier3Price: 0,
  //         });
  //       }
  //     });

  //     itemsTemp.push({
  //       itemId: "-",
  //       description: "Sub-Total",
  //       specification: "",
  //       uom: "",
  //       quantity: 0,
  //       price: 0,
  //       typeId: "",
  //       supplier1Selected: false,
  //       supplier1Id: "",
  //       supplier1Name: "",
  //       supplier1Qty: 0,
  //       supplier1Price: _typeItem.reduce((accum, curr) => accum + (curr.supplier1Price * curr.supplier1Qty), 0),
  //       supplier2Selected: false,
  //       supplier2Id: "",
  //       supplier2Name: "",
  //       supplier2Qty: 0,
  //       supplier2Price: _typeItem.reduce((accum, curr) => accum + (curr.supplier2Price * curr.supplier2Qty), 0),
  //       supplier3Selected: false,
  //       supplier3Id: "",
  //       supplier3Name: "",
  //       supplier3Qty: 0,
  //       supplier3Price: _typeItem.reduce((accum, curr) => accum + (curr.supplier3Price * curr.supplier3Qty), 0),
  //     });
  //   });

  //   var ctr: number = 1;
  //   itemsTemp.forEach(_item => {
  //     if (_item.itemId != '' && _item.itemId != '-' && _item.itemId != 'x') {
  //       _item.itemId = ctr.toString();
  //       ctr += 1;
  //     }
  //   });
    
  //   var printItemsTemp: SupplierItems[] = [];
  //   this.module.aocPrintData = [];
  //   var len: number = this.getPrintLength(itemsTemp.length);
  //   var subTotalSupp1: number = 0;
  //   var subTotalSupp2: number = 0;
  //   var subTotalSupp3: number = 0;
  //   for (var i = 0; i < len; i++) {
  //     if (itemsTemp[i]) {
  //       printItemsTemp.push(itemsTemp[i]);
  //       if (i > 0 && itemsTemp[i-1].typeId == itemsTemp[i].typeId) {
  //         subTotalSupp1 += itemsTemp[i].supplier1Price * itemsTemp[i].supplier1Qty;
  //         subTotalSupp2 += itemsTemp[i].supplier2Price * itemsTemp[i].supplier2Qty;
  //         subTotalSupp3 += itemsTemp[i].supplier3Price * itemsTemp[i].supplier3Qty;
  //       } else {
  //         subTotalSupp1 = 0; 
  //         subTotalSupp2 = 0; 
  //         subTotalSupp3 = 0; 
  //         subTotalSupp1 += itemsTemp[i].supplier1Price * itemsTemp[i].supplier1Qty;
  //         subTotalSupp2 += itemsTemp[i].supplier2Price * itemsTemp[i].supplier2Qty;
  //         subTotalSupp3 += itemsTemp[i].supplier3Price * itemsTemp[i].supplier3Qty;
  //       }
  //     } else {
  //       printItemsTemp.push({
  //         itemId: "-",
  //         description: "",
  //         specification: "",
  //         uom: "",
  //         quantity: 0,
  //         price: 0,
  //         typeId: "",
  //         supplier1Selected: false,
  //         supplier1Id: "",
  //         supplier1Name: "",
  //         supplier1Qty: 0,
  //         supplier1Price: 0,
  //         supplier2Selected: false,
  //         supplier2Id: "",
  //         supplier2Name: "",
  //         supplier2Qty: 0,
  //         supplier2Price: 0,
  //         supplier3Selected: false,
  //         supplier3Id: "",
  //         supplier3Name: "",
  //         supplier3Qty: 0,
  //         supplier3Price: 0,
  //       });
  //     }

  //     // NOT APPLICABLE FOR CURRENT RELEASE --- START
  //     // if (((i+1) % 25 == 0 && i != 0) && printItemsTemp[printItemsTemp.length-1].description != '') {
  //     //   var item = new SupplierItems(
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
  //     //   printItemsTemp.push(new SupplierItems("", "", "", "", 0, 0, 0, "", 0, 0, ""));
  //     // }
  //     // NOT APPLICABLE FOR CURRENT RELEASE --- END

  //     if (printItemsTemp.length >= 15) { // CHANGED 26 TO 25 FOR CURRENT RELEASE (HIDDEN SUB TOTAL PER PAGE)
  //       this.module.aocPrintData.push(printItemsTemp);
  //       printItemsTemp = [];
  //     }
  //   }
  // }

  getPrintLength(currLen: number): number {
    var wholePage = Math.trunc(currLen / 19) * 19;
    var rem = currLen - wholePage;
    if (rem > 0) {
      wholePage += 19;
    }

    return wholePage;
  }

  public calculateTotal(_supp: number): number {
    var retVal: number = 0;
    switch (_supp) {
      case 1:
        retVal = this.module.aocData?.reduce((accum, curr) => accum + (curr.supplier1Price * curr.supplier1Qty), 0);
        break;
      case 2:
        retVal = this.module.aocData?.reduce((accum, curr) => accum + (curr.supplier2Price * curr.supplier2Qty), 0);
        break;
      case 3:
        retVal = this.module.aocData?.reduce((accum, curr) => accum + (curr.supplier3Price * curr.supplier3Qty), 0);
        break;
    }
    return retVal;
  }

  async getProjectData(_id: string) {
    await this.httpRequest.getAbstractOfCanvassProject(_id).subscribe((result) => {
      if (result.statusCode == 200) {
        this.transData = result.data[0];
      }
    });
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  viewData(data: AbstractOfCanvassModel) {
    this.router.navigate(["/abstract-of-canvass", { id: data.id }]);
  }

  async printData(index: number){
    // this.selectedAOC = this.dataSource.data[index];
    // await this.getProjectData(this.selectedAOC.id);
    // setTimeout(() => 
    // {
    //   let el: HTMLElement = this.printBtn.nativeElement;
    //   el.click();
    // },
    // 500);
  }

  async printAward(aoc: AbstractOfCanvassModel){
    await this.getProjectData(aoc.id);
    setTimeout(() => 
    {
      let el: HTMLElement = this.printAwardBtn.nativeElement;
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

  async rowSelected(row: AbstractOfCanvassModel) {
    this.selectedAOC = row;
    await this.getProjectData(this.selectedAOC.id);
    this.loadItemsForPrint();
  }

  onContextMenu(event: MouseEvent, item: AbstractOfCanvassModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuAction1(item: AbstractOfCanvassModel) {
    alert(`Click on Action 1 for ${item.supplier}`);
  }

  onContextMenuAction2(item: AbstractOfCanvassModel) {
    alert(`Click on Action 2 for ${item.supplier}`);
  }

  hasAwardedItem(data: AbstractOfCanvassModel): boolean {
    var _hasAwardedItem: boolean = false;

    data.supplier.forEach(_supp => {
      _supp.items.forEach(_sItem => {
        if (_sItem.awarded) {
          _hasAwardedItem = true;
        }
      })
    })

    return _hasAwardedItem;
  }

  hasApprovedItem(data: AbstractOfCanvassModel): boolean {
    var _hasApprovedItem: boolean = false;

    data.supplier.forEach(_supp => {
      var suppItems = _supp.items.filter(itm => itm.awarded == true);
      if (suppItems.length > 0) {
        _hasApprovedItem = true;
      }
    })

    return _hasApprovedItem;
  }

  hasPO(data: AbstractOfCanvassModel): boolean {
    var _hasPO: boolean = false;

    data.supplier.forEach(_supp => {
      if (_supp.hasPo) {
        _hasPO = true;
      }
    })

    return _hasPO;
  }

  approveMenuAction(data: AbstractOfCanvassModel) {
    const dialogRef = this.dialog.open(AwardDialogComponent, {
      data: {
        abstractOfCanvass: data,
        action: "Approve"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var aoc = result.abstractOfCanvass;
        this.httpRequest.updateAbstractOfCanvass(aoc.id, aoc).subscribe((result) => {
          if (result.statusCode == 200) {
            this.notifService.showNotification(NotificationType.success, "Successfully saved!");
          } else {
            this.notifService.showNotification(NotificationType.error, "Saving Data Failed!");
          }
        });
      }
    });
  }

  awardMenuAction(data: AbstractOfCanvassModel) {
    const dialogRef = this.dialog.open(AwardDialogComponent, {
      data: {
        abstractOfCanvass: data,
        action: "Award"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var aoc = result.abstractOfCanvass;
        this.httpRequest.updateAbstractOfCanvass(aoc.id, aoc).subscribe((result) => {
          if (result.statusCode == 200) {
            this.notifService.showNotification(NotificationType.success, "Successfully saved!");
          } else {
            this.notifService.showNotification(NotificationType.error, "Saving Data Failed!");
          }
        });
      }
    });
  }

  createFn() {
    const dialogRef = this.dialog.open(AbstractOfCanvassComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  isAOCAvailableForEditDelete(_selectedAOC: AbstractOfCanvassModel): boolean {
    var retVal: boolean = true;

    _selectedAOC.supplier.forEach(supp => {
      var suppItems = supp.items.filter(itm => itm.approved == true || itm.awarded == true);
      if (suppItems.length > 0) {
        retVal = false;
      }
    });

    return retVal;
  }

  editFn() {
    if (!this.module.isAOCAvailableForEditDelete(this.module.selectedAOC)) {
      this.module.notifService.showNotification(NotificationType.error, "Selected AOC is already Awarded/Approved!");
      return;
    }

    const dialogRef = this.dialog.open(AbstractOfCanvassComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedAOC
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    if (!this.module.isAOCAvailableForEditDelete(this.module.selectedAOC)) {
      this.module.notifService.showNotification(NotificationType.error, "Selected AOC is already Awarded/Approved!");
      return;
    }

    this.module.httpRequest.deleteAbstractOfCanvass(this.module.selectedAOC.id).subscribe((result) => {
      if (result.statusCode == 200) {
        this.module.notifService.showNotification(NotificationType.success, "Successfully deleted!");
        this.module.loadData();
      } else {
        this.module.notifService.showNotification(NotificationType.error, "Delete Data Failed!");
      }
    });
  }

  printFn(){
    this.module.loadItemsForPrint();
    setTimeout(() => 
    {
      let el: HTMLElement = this.module.selectedRFQ.biddingType == "Public Bidding" ? this.module.printBtnAOB.nativeElement : this.module.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  printPreview() {
    if (this.module.selectedRFQ.biddingType == "Public Bidding") {
      const dialogRef = this.dialog.open(PrintPreviewAobComponent, {
        data: {
          selectedAOC: this.module.selectedAOC,
          selectedRFQ: this.module.selectedRFQ,
          selectedAOCData: this.module.aocData,
          selectedAOCItemsPrint: this.module.aocPrintData,
          itemsTotalAmt: this.module.itemsTotalAmt,
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.module.printFn();
        }
      });
    } else {
      const dialogRef = this.dialog.open(PrintPreviewAocComponent, {
        data: {
          selectedAOC: this.module.selectedAOC,
          selectedAOCData: this.module.aocData,
          selectedAOCItemsPrint: this.module.aocPrintData,
          itemsTotalAmt: this.module.itemsTotalAmt,
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.module.printFn();
        }
      });
    }
  }
}
