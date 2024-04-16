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
import { map, Observable, startWith } from 'rxjs';
import { ProjectProposalSOFModel } from 'src/app/data-model/project-proposal-sof-model';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';
import { Type } from 'src/app/data-model/type';
import { AuthService } from 'src/app/services/auth.service';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { PrintPreviewPrComponent } from '../print-preview-pr/print-preview-pr.component';
import { PurchaseRequestAttachmentComponent } from '../purchase-request-attachment/purchase-request-attachment.component';
import { PurchaseRequestLogsComponent } from '../purchase-request-logs/purchase-request-logs.component';
import { PurchaseRequestComponent } from '../purchase-request.component';
import { PrListItemsComponent } from './pr-list-items/pr-list-items.component';
import { PurchaseRequestXLSX } from './purchase-request.xlsx';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';

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
  selector: 'app-purchaserequestlist',
  templateUrl: './purchaserequestlist.component.html',
  styleUrls: ['./purchaserequestlist.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PurchaseRequestListComponent implements OnInit {
  env = environment;
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['logs','prNo','prDate', 'prQtr', 'prAmount', 'budget', 'departmentName', 'sourceOfFund', 'accounts', 'rationale', 'action'];
  displayedColumnsItemDetails: string[] = ['no','description', 'quantity', 'uom', 'cost', 'total', 'remarks'];
  prList: PurchaseRequestModel[] = [];
  dataSource: MatTableDataSource<PurchaseRequestModel> = new MatTableDataSource<PurchaseRequestModel>(this.prList);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
  selectedPR: PurchaseRequestModel;
  selectedPRItemsPrint: PurchaseRequestItemsModel[][];
  dateValue = new FormControl(moment());
  textFilterStr: string = "";
  dateFilterType: string = "Quarter";
  dateFrom: Date = new Date();
  dateTo: Date =  new Date();
  qtrFilter: string = "";
  qtrYearFilter: string = (new Date).getFullYear().toString();
  qtrYearSelection: string[] = [];
  itemTextFilterStr: string = "";
  module = this;
  excelFormat = new PurchaseRequestXLSX();
  itemTypeList: Type[];
  isLoading = false;

  formControlClass = new FormControl('');
  selectedItemClass: string = "";
  filteredClass: Observable<string[]>;
  groupList: string[] = [];

  constructor(
    public authService: AuthService,
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;
  @ViewChild('printPage') printPage: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.setQuarter(new Date());
    const ctrlValue = this.dateValue.value;
    ctrlValue.year((new Date()).getFullYear());
    ctrlValue.month((new Date()).getMonth());
    this.dateValue.setValue(ctrlValue);

    for (var i = 2022; i <= (new Date).getFullYear(); i ++) {
      this.qtrYearSelection.push(i.toString());
    }

    this.loadItemType();
  }
  
  async ngAfterViewInit() {
    this.commonFunction.createFn = this.createFn;
    this.commonFunction.editFn = this.editFn;
    this.commonFunction.deleteFn = this.deleteFn;
    this.commonFunction.printFn = this.printFn;
    this.commonFunction.printPreviewFn = this.printPreview;
    this.commonFunction.exportFn = this.exportToExcel;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
    this.commonFunction.dialog = this.dialog;
  }

  setQuarter(date: Date) {
    switch(Math.floor(((date).getMonth() + 3) / 3)) {
      case 1:
        this.qtrFilter = "Q1"
        break;
      case 2:
        this.qtrFilter = "Q2"
        break;
      case 3:
        this.qtrFilter = "Q3"
        break;
      case 4:
        this.qtrFilter = "Q4"
        break;
    }
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
    this.itemTextFilterStr = "";
    this.clearClassFilter();
    this.isLoading = true;
    if (this.authService.getTypeId() == environment.gsoDeptId.toString()) {
      switch (this.dateFilterType) {
        case "Monthly":
          this.httpRequest.getAllPurchaseRequestIncludingClosedByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
            if (result.statusCode == 200) {
              this.formatData(result.data);
            }
            this.isLoading = false;
          });
          break;
        case "DateRange":
          this.httpRequest.getAllPurchaseRequestIncludingClosedByDateRange(this.datepipe.transform(this.dateFrom, 'yyyy-MM-dd'), this.datepipe.transform(this.dateTo, 'yyyy-MM-dd')).subscribe((result) => {
            if (result.statusCode == 200) {
              this.formatData(result.data);
            }
            this.isLoading = false;
          });
          break;
        case "Quarter":
          this.httpRequest.getAllPurchaseRequestIncludingClosedByQuarter(this.qtrFilter, this.qtrYearFilter).subscribe((result) => {
            if (result.statusCode == 200) {
              this.formatData(result.data);
            }
            this.isLoading = false;
          });
          break
      }
    } else {
      switch (this.dateFilterType) {
        case "Monthly":
          this.httpRequest.getAllPurchaseRequestByDepartmentMonthYear(this.authService.getTypeId(), this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
            if (result.statusCode == 200) {
              this.formatData(result.data);
            }
            this.isLoading = false;
          });
          break;
        case "DateRange":
          this.httpRequest.getAllPurchaseRequestByDepartmentByDateRange(this.authService.getTypeId(), this.datepipe.transform(this.dateFrom, 'yyyy-MM-dd'), this.datepipe.transform(this.dateTo, 'yyyy-MM-dd')).subscribe((result) => {
            if (result.statusCode == 200) {
              this.formatData(result.data);
            }
            this.isLoading = false;
          });
          break;
        case "Quarter":
          this.httpRequest.getAllPurchaseRequestByDepartmentByQuarter(this.authService.getTypeId(), this.qtrFilter, this.qtrYearFilter).subscribe((result) => {
            if (result.statusCode == 200) {
              this.formatData(result.data);
            }
            this.isLoading = false;
          });
          break
      }
    }
  }

  formatData(data: PurchaseRequestModel[]) {
    this.prList = data;
    this.dataSource = new MatTableDataSource<PurchaseRequestModel>(this.prList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.prList.length) {
      this.selectedPR = this.prList[0];
      this.loadItemsForPrint(this.prList[0].items);
    } else {
      this.selectedPR = null;
    }

    this.groupList = [];
    this.prList.forEach(_pr => {
      _pr.sof.forEach(_sof => {
        if (!this.groupList.find(_g => _g.trim() == _sof.sofDescription.trim())) {
          this.groupList.push(_sof.sofDescription.trim());
        }
      });
    });

    this.filteredClass = this.formControlClass.valueChanges.pipe(
      startWith(''),
      map(value => this._filterClass(value || '')),
    );
  }

  cloneItemsForPrint(items: PurchaseRequestItemsModel[]): PurchaseRequestItemsModel[] {
    var _retItems: PurchaseRequestItemsModel[] = [];

    items.forEach(_item => {
      _retItems.push(new PurchaseRequestItemsModel(
        _item.id,
        _item.itemId,
        _item.description,
        _item.specification,
        _item.typeId,
        _item.quantity,
        _item.dbmQty,
        _item.callOutQty,
        _item.uom,
        _item.cost,
        _item.total,
        _item.remarks,
        _item.consPrId,
        _item.appId,
        _item.accId,
      ));
    });

    return _retItems;
  }

  loadItemsForPrint(_items: PurchaseRequestItemsModel[]) {
    var items = this.cloneItemsForPrint(_items);
    items = items.filter(item => item.quantity > 0);
    
    var itemsTemp: PurchaseRequestItemsModel[] = [];

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
              itemsTemp.push(new PurchaseRequestItemsModel("x", "", _itemSpec, "", "", 0, 0, 0, "", 0, 0, "", "", 0));
              _itemSpec = "";
              _itemSpec_temp = _txt;
            }
            _itemSpec += (indx == 0 ? "• " : " ") + _txt;
            if (indx == _spec.length-1) {
              itemsTemp.push(new PurchaseRequestItemsModel("x", "", _itemSpec, "", "", 0, 0, 0, "", 0, 0, "", "", 0));
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
    
    var printItemsTemp: PurchaseRequestItemsModel[] = [];
    this.selectedPRItemsPrint = [];
    var len: number = this.getPrintLength(itemsTemp.length);
    var subTotal: number = 0;
    for (var i = 0; i < len; i++) {
      if (itemsTemp[i]) {
        printItemsTemp.push(itemsTemp[i]);
        subTotal += itemsTemp[i].total;
      } else {
        var item = new PurchaseRequestItemsModel("", "", "", "", "", 0, 0, 0, "", 0, 0, "");
        printItemsTemp.push(item);
      }

      if (((i+1) % 25 == 0 && i != 0) && printItemsTemp[printItemsTemp.length-1].description != '') {
        var item = new PurchaseRequestItemsModel(
          "-",
          "",
          "Sub-Total",
          "",
          "",
          0,
          0,
          0,
          "",
          0,
          subTotal,
          "",
        );
        printItemsTemp.push(item);
        subTotal = 0;
      } else if (i == itemsTemp.length-1) {
        printItemsTemp.push(new PurchaseRequestItemsModel("", "", "", "", "", 0, 0, 0, "", 0, 0, ""));
      }

      if (printItemsTemp.length >= 26) {
        this.selectedPRItemsPrint.push(printItemsTemp);
        printItemsTemp = [];
      }
    }
  }

  // loadItemsForPrint(_items: PurchaseRequestItemsModel[]) {
  //   var items = this.cloneItemsForPrint(_items);
  //   items = items.filter(item => item.quantity > 0);
  //
  //   var typeTemp: string[] = [...new Set(items.map(item => item.typeId))];
  //   var itemsTemp: PurchaseRequestItemsModel[] = [];
  //   typeTemp.forEach((_type) => {
  //     itemsTemp.push(new PurchaseRequestItemsModel(
  //       "0",
  //       "",
  //       this.itemTypeList.find((type) => type.id == _type)?.description || "Unknown Item Type",
  //       "",
  //       "",
  //       0,
  //       0,
  //       0,
  //       "",
  //       0,
  //       0,
  //       "",
  //       "",
  //       0
  //     ));
  //     var _typeItem: PurchaseRequestItemsModel[] = items.filter(_item => _item.typeId == _type);
  //     _typeItem.forEach(_itm => {
  //       itemsTemp.push(_itm);
  //       if (_itm.specification) {
  //         itemsTemp.push(new PurchaseRequestItemsModel(
  //           "x",
  //           "",
  //           _itm.specification,
  //           "",
  //           "",
  //           0,
  //           0,
  //           0,
  //           "",
  //           0,
  //           0,
  //           "",
  //           "",
  //           0
  //         ));
  //       }
  //     });
  //
  //     itemsTemp.push(new PurchaseRequestItemsModel(
  //       "-",
  //       "",
  //       "Sub-Total",
  //       "",
  //       "",
  //       0,
  //       0,
  //       0,
  //       "",
  //       0,
  //       _typeItem.reduce((accum, curr) => accum + curr.total, 0),
  //       "",
  //     ));
  //   });
  //
  //   var ctr: number = 1;
  //   itemsTemp.forEach(_item => {
  //     if (_item.id != '0' && _item.id != '-' && _item.id != 'x') {
  //       _item.id = ctr.toString();
  //       ctr += 1;
  //     }
  //   });
  //
  //   var printItemsTemp: PurchaseRequestItemsModel[] = [];
  //   this.selectedPRItemsPrint = [];
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
  //       var item = new PurchaseRequestItemsModel("", "", "", "", "", 0, 0, 0, "", 0, 0, "")
  //       printItemsTemp.push(item);
  //     }
  //
  //     // NOT APPLICABLE FOR CURRENT RELEASE --- START
  //     // if (((i+1) % 25 == 0 && i != 0) && printItemsTemp[printItemsTemp.length-1].description != '') {
  //     //   var item = new PurchaseRequestItemsModel(
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
  //     //   printItemsTemp.push(new PurchaseRequestItemsModel("", "", "", "", 0, 0, 0, "", 0, 0, ""));
  //     // }
  //     // NOT APPLICABLE FOR CURRENT RELEASE --- END

  //     if (printItemsTemp.length >= 25) { // CHANGED 26 TO 25 FOR CURRENT RELEASE (HIDDEN SUB TOTAL PER PAGE)
  //       this.selectedPRItemsPrint.push(printItemsTemp);
  //       printItemsTemp = [];
  //     }
  //   }
  // }

  getPrintLength(currLen: number): number {
    var wholePage = Math.trunc(currLen / 25) * 25;
    var rem = currLen - wholePage;
    if (rem > 0) {
      wholePage += 25;
    }

    return wholePage;
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    if (filterValue.substring(0,2) == "d$") {
      if (filterValue.substring(2) != "") {
        this.dataSource.filter = filterValue.substring(2);
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return data.departmentName.toLowerCase().includes(filter);
        };      
      }
    } else {
      this.dataSource.filter = filterValue;
    }
  }

  private _filterClass(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.groupList.filter(option => option.toLowerCase().includes(filterValue));
  }

  selectionChanged(event: any) {
    this.classFilter();
  }

  clearClassFilter() {
    this.selectedItemClass = "";
    this.classFilter();
  }

  classFilter() {
    this.textFilterStr = "";
    if (this.selectedItemClass != "") {
      var _filterdTrans = this.prList.filter(_trans => _trans.sof.find(_acc => _acc.sofDescription == this.selectedItemClass));
      this.dataSource = new MatTableDataSource<PurchaseRequestModel>(_filterdTrans);
    } else {
      this.dataSource = new MatTableDataSource<PurchaseRequestModel>(this.prList);
    }
  }

  rowSelected(row: PurchaseRequestModel) {
    this.selectedPR = row;
    this.loadItemsForPrint(row.items);
  }

  viewData(data: PurchaseRequestModel) {
    this.router.navigate(["/purchase-request", { id: data.id }]);
  }

  viewLogs(data: PurchaseRequestModel) {
    const dialogRef = this.dialog.open(PurchaseRequestLogsComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: data
    }});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.module.loadData();
      }
    });
  }

  viewItems(data: PurchaseRequestModel) {
    const dialogRef = this.dialog.open(PrListItemsComponent, {
      data: {
        selectedData: data,
        typeList: this.itemTypeList
      },
    });
  }

  exportToExcel() {
    var _pr: PurchaseRequestModel = new PurchaseRequestModel(
      this.module.selectedPR.id,
      this.module.selectedPR.prType,
      this.module.selectedPR.prNo,
      this.module.selectedPR.prDate,
      this.module.selectedPR.prQtr,
      this.module.selectedPR.title,
      this.module.selectedPR.departmentId,
      this.module.selectedPR.departmentName,
      this.module.selectedPR.sectionId,
      this.module.selectedPR.sectionName,
      this.module.selectedPR.alobsNo,
      this.module.selectedPR.alobsDate,
      this.module.selectedPR.saiNo,
      this.module.selectedPR.saiDate,
      this.module.selectedPR.transactionNo,
      this.module.selectedPR.transactionDate,
      this.module.selectedPR.ppId,
      this.module.selectedPR.ppNo,
      this.module.selectedPR.sourceOfFund,
      this.module.selectedPR.rationale,
      this.module.selectedPR.procurementMode,
      this.module.selectedPR.entryByDepartment,
      this.module.selectedPR.entryByUser,
      this.module.selectedPR.requestedByName,
      this.module.selectedPR.requestedByPosition,
      this.module.selectedPR.cashAvailabilityName,
      this.module.selectedPR.cashAvailabilityPosition,
      this.module.selectedPR.approvedByName,
      this.module.selectedPR.approvedByPosition,
      this.module.selectedPR.status,
      this.module.selectedPR.sof,
      this.module.selectedPR.imgAtt,
      this.module.selectedPRItemsPrint.flat().filter((item) => item.quantity > 0 || ['0','-'].indexOf(item.id) >= 0)
    );
    this.module.excelFormat.generateXLSXFormat(_pr);
  }

  printData(index: number){
    this.selectedPR = this.prList[index];
    this.loadItemsForPrint(this.prList[index].items);
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  printPreview() {
    const dialogRef = this.dialog.open(PrintPreviewPrComponent, {
      data: {
        selectedPR: this.module.selectedPR,
        selectedPRItemsPrint: this.module.selectedPRItemsPrint
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.printFn();
      }
    });
  }

  viewAttachment(index: number) {
    const dialogRef = this.dialog.open(PurchaseRequestAttachmentComponent, {panelClass: 'custom-dialog-container'});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.module.loadData();
      }
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
  }

  selectDateRange() {
  }

  selectQtr() {
  }

  public calculateTotal() {
    if (this.selectedPR) {
      return this.selectedPR.items?.reduce((accum, curr) => accum + curr.total, 0);
    } else {
      return 0;
    }
  }

  public calculatePRItemsTotal(_items: PurchaseRequestItemsModel[]) {
    return _items.reduce((accum, curr) => accum + curr.total, 0);
  }

  public calculateAllPRItemsTotal() {
    var totalPRAmount: number = 0;
    this.dataSource.data.forEach(_pr => {
      totalPRAmount += _pr.items.reduce((accum, curr) => accum + curr.total, 0);
    })
    return totalPRAmount;
  }

  public calculateAccountTotal(_sofs: ProjectProposalSOFModel[]) {
    return _sofs.reduce((accum, curr) => accum + curr.amount, 0);
  }

  public calculateAccountAllTotal() {
    var totalAccountAmount: number = 0;
    this.dataSource.data.forEach(_pr => {
      totalAccountAmount += _pr.sof.reduce((accum, curr) => accum + curr.amount, 0);
    })
    return totalAccountAmount;
  }

  public getPRAccounts(_sofs: ProjectProposalSOFModel[]) {
    var _accs: string[] = [];
    _sofs.forEach(_sof => {
      if (!_accs.find(x => x == _sof.sofDescription)) {
        _accs.push(_sof.sofDescription);
      }
    });
    return _accs.join(', ');
  }

  lockPR(_pr: PurchaseRequestModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirm",
        message: "Are you sure do you want to " + (_pr.isLocked ? 'unlock' : 'lock') + " selected data?",
        btnOkText: "Yes",
        btnCancelText: "No",
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpRequest.setLockPurchaseRequest(_pr.id, !_pr.isLocked).subscribe((result) => {
          if (result.statusCode == 200) {
            this.notifService.showNotification(NotificationType.success, "Selected PR is now Locked!");
            _pr.isLocked = !_pr.isLocked;
          } else {
            this.notifService.showNotification(NotificationType.error, "Updating Data Failed!");
          }
        });
      }
    });
  }

  createFn() {
    const dialogRef = this.dialog.open(PurchaseRequestComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  isPRAvailableForEditDelete(prId: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.module.httpRequest.getPurchaseRequestTransactionCount(prId).subscribe((result) => {
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
    if (this.module.selectedPR.status == "CLOSED") {
      this.module.notifService.showNotification(NotificationType.error, "Unable to edit Closed Transaction!");
      return;
    }
    if (this.module.selectedPR.isLocked) {
      this.module.notifService.showNotification(NotificationType.error, "Unable to edit Locked Transaction!");
      return;
    }
    
    this.module.isPRAvailableForEditDelete(this.module.selectedPR.id).then((val) => {
      if (val) {
        const dialogRef = this.dialog.open(PurchaseRequestComponent, {panelClass: 'custom-dialog-container', data: {
          selectedData: this.module.selectedPR
        }},);
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.module.loadData();
          }
        });
      } else {
        this.module.notifService.showNotification(NotificationType.error, "Selected transaction has RFQ/PO!");
      }
    });
  }

  deleteFn() {
    if (this.module.selectedPR.status == "CLOSED") {
      this.module.notifService.showNotification(NotificationType.error, "Unable to delete Closed Transaction!");
      return;
    }
    if (this.module.selectedPR.isLocked) {
      this.module.notifService.showNotification(NotificationType.error, "Unable to delete Locked Transaction!");
      return;
    }
    
    this.module.isPRAvailableForEditDelete(this.module.selectedPR.id).then((val) => {
      if (val) {
        this.module.httpRequest.deletePurchaseRequest(this.module.selectedPR.id).subscribe((result) => {
          if (result.statusCode == 200) {
            this.module.notifService.showNotification(NotificationType.success, "Successfully deleted!");
            this.module.loadData();
          } else {
            this.module.notifService.showNotification(NotificationType.error, "Delete Data Failed!");
          }
        });
      } else {
        this.module.notifService.showNotification(NotificationType.error, "Selected transaction has RFQ/PO!");
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
