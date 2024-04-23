import { SelectionModel } from '@angular/cdk/collections';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Accounts } from "src/app/data-model/Accounts";
import { HttpRequestService } from "src/app/services/http-request.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../purchase-request.component";
import { NotificationService } from "src/app/services/notification.service";
import { MatSelectChange } from "@angular/material/select";
import { AppItemModel } from 'src/app/data-model/app-item-model';
import { NotificationType } from 'src/app/util/notification_type';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Group } from 'src/app/data-model/group';
import { map, Observable, startWith } from 'rxjs';
import { Type } from 'src/app/data-model/type';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { Item } from 'src/app/data-model/item';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-app-selection-dialog',
  templateUrl: './app-selection-dialog.component.html',
  styleUrls: ['./app-selection-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AppSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['check','no','itemCode','itemName','uom','qty','price','total','first_qtr_qty','second_qtr_qty','third_qtr_qty','fourth_qtr_qty'];
  selection = new SelectionModel<AppItemModel>(true, []);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  dateValue = new FormControl(moment());
  selectedSOF: {value: string, text: string} = {value: null, text: ""};
  appItems: MatTableDataSource<AppItemModel> = new MatTableDataSource<AppItemModel>([]);
  appItemsList: AppItemModel[];
  deptSelected: { value: string; text: string } = {value: "", text: ""};

  formControlClass = new FormControl('');
  formControlType = new FormControl('');
  selectedItemClass: string = "";
  selectedItemType: string = "";
  filteredClass: Observable<string[]>;
  groupList: string[] = [];
  filteredType: Type[];
  groupType: Group[];
  groupTypeTemp: Group[];
  filteredGroupType: Observable<Group[]>;
  itemType: string = "";
  account_balance: number = 0;
  pr_amount: number = 0;
  account_budget: number = 0;

  listItems: Item[] = [];

  defaultSOF: string;
  defaultDept: string;
  defaultFund: number;
  account: number = 0;

  excludeZeroQty: boolean = false;
  excludeNotPr: boolean = false;
  firstQtrChk: boolean = false;
  secondQtrChk: boolean = false;
  thirdQtrChk: boolean = false;
  fourthQtrChk: boolean = false;

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private httpRequest: HttpRequestService,
    private dialogRef: MatDialogRef<AppSelectionDialogComponent>,
    private notifService : NotificationService,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.defaultDept = this.data.defaultDept || this.authService.getTypeId();
    this.defaultFund = 4;
    this.defaultSOF = "1";
    this.selectedSOF = {
      value: this.defaultFund.toString(),
      text: this.data.sofList.find((x) => x.id == this.defaultSOF.toString()).SOFName
    };
    this.httpRequest.getDepartmentById(this.defaultDept).subscribe((result) => {
      if (result.statusCode == 200) {
        this.deptSelected = {value: result.data.id, text: result.data.name};
      }
    });
    this.loadItems();
    this.loadGroupType();
    this.loadAPPItems();
    this.checkQuarter();
  }

  loadItems() {
    this.httpRequest.getListAllItems().subscribe((result) => {
      if (result.statusCode == 200) {
        this.listItems = result.data;
      } else {
        this.notifService.showNotification(NotificationType.error, "Failed to load Items.");
      }
    });
  }

  loadGroupType() {
    this.httpRequest.getItemGroupWithType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.groupType = result.data;
        this.groupTypeTemp = result.data;
      }
    });
  }

  filterGroup(val: string): Group[] {
    if (val) {
      return this.groupTypeTemp
        .map(group => ({ id: group.id, description: group.description, type: this._filter(group.type, val) }))
        .filter(group => group.type.length > 0);
    }

    return this.groupTypeTemp;
  }

  private _filterClass(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.groupList.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filter(opt: Type[], val: string): Type[] {
    const filterValue = val.toLowerCase();
    this.filteredType = opt.filter(item => item.description.toLowerCase().startsWith(filterValue));

    if (this.filteredType.length > 0) {
      this.itemType = this.filteredType[0].id;
    }

    return this.filteredType;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.appItems.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.appItems.data.forEach(row => this.selection.select(row));
  }

  accountSelectionChanged(event: any) {
    this.groupTypeTemp = this.groupType;
    var itemTypesApp = [...new Set(this.appItemsList.filter((i) => i.appropriationName == this.selectedItemClass).map(item => item.typeId))];
    var itemTypes: Group[] = [];
    itemTypes = this.groupTypeTemp
    .map(group => ({ id: group.id, description: group.description, type: this._filterType(group.type, itemTypesApp) }))
    .filter(group => group.type.length > 0);

    this.groupTypeTemp = itemTypes;

    this.filteredGroupType = this.formControlType.valueChanges.pipe(
      startWith(''),
      map(value => this.filterGroup(value || '')),
    );
    this.excludeZeroCheckChanged();
    this.selection.clear();
    this.computeAccountBalance();
  }

  excludeZeroCheckChanged() {
    var items: AppItemModel[] = [];
    if (this.itemType != "" && this.selectedItemClass == "") {
      if (this.excludeZeroQty) {
        items = this.appItemsList.filter((app) => app.typeId == this.itemType && app.qty != 0);
      } else {
        items = this.appItemsList.filter((app) => app.typeId == this.itemType);
      }
    } else if (this.itemType == "" && this.selectedItemClass != "") {
      if (this.excludeZeroQty) {
        items = this.appItemsList.filter((app) => app.appropriationName == this.selectedItemClass && app.qty != 0);
      } else {
        items = this.appItemsList.filter((app) => app.appropriationName == this.selectedItemClass);
      }
    } else if (this.itemType != "" && this.selectedItemClass != "") {
      if (this.excludeZeroQty) {
        items = this.appItemsList.filter((app) => app.typeId == this.itemType && app.appropriationName == this.selectedItemClass && app.qty != 0);
      } else {
        items = this.appItemsList.filter((app) => app.typeId == this.itemType && app.appropriationName == this.selectedItemClass);
      }
    } else {
      if (this.excludeZeroQty) {
        items = this.appItemsList.filter((app) => app.qty != 0);
      } else {
        items = this.appItemsList;
      }
    }
    this.appItems = new MatTableDataSource<AppItemModel>(items);

    this.groupList = [...new Set(this.appItemsList.map(item => item.appropriationName))];
  }

  excludeItemNotForPR() {

  }

  selectionChanged(event: any) {
    this.excludeZeroCheckChanged();
    this.selection.clear();

    this.computeAccountBalance();
  }

  computeAccountBalance() {
    var accounts: Accounts[];
    var sofId: number = this.appItems.data[0].appropriationId;
    this.httpRequest.getSourceOfFundByIds([sofId]).subscribe((result) => {
      if (result.statusCode == 201) {
        accounts = result.data;

        this.httpRequest.getTotalPOPerDept(this.deptSelected.value, this.dateValue.value.year(), sofId.toString()).subscribe((result) => {
          if (result.statusCode == 200) {
            this.account_budget = +accounts[0].amount;
            this.pr_amount = (result.data[0][0]?.total || 0);
            this.account_balance = +accounts[0].amount - (result.data[0][0]?.total || 0);
          } else {
            this.notifService.showNotification(NotificationType.error, "There is a problem in fetching data. Please try again.");
          }
        });
      } else {
        this.notifService.showNotification(NotificationType.error, "There is a problem in fetching data. Please try again.");
      }
    });
  }

  clearClassFilter() {
    this.selectedItemClass = "";
    this.excludeZeroCheckChanged();
    this.selection.clear();
    this.account_balance = 0;
  }

  clearFilter() {
    this.selectedItemType = "";
    this.itemType = "";
    this.excludeZeroCheckChanged();
    this.selection.clear();
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.appItems.filter = filterValue;
  }

  checkQuarter() {
    switch(Math.floor(((new Date).getMonth() + 3) / 3)) {
      case 1:
        this.firstQtrChk = true;
        break;
      case 2:
        this.secondQtrChk = true;
        break;
      case 3:
        this.thirdQtrChk = true;
        break;
      case 4:
        this.fourthQtrChk = true;
        break;
    }
  }

  sofSelectionChanged(event: MatSelectChange) {
    this.selectedSOF = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  setYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    var d = normalizedMonthAndYear.toString();
    var dateVal = new Date(d);
    const ctrlValue = this.dateValue.value;
    ctrlValue.year(dateVal.getFullYear());
    this.dateValue.setValue(ctrlValue);
    datepicker.close();
    this.loadAPPItems();
  }

  loadAPPItems() {
    this.httpRequest.getAllAPPItems(this.dateValue.value.year(), this.defaultDept).subscribe((result) => {
      if (result.statusCode == 200) {
        if (result.data.length == 0) {
          this.notifService.showNotification(NotificationType.info, "No data found.");
        }
        this.appItemsList = this.formatAppItems(result.data);
        this.appItems = new MatTableDataSource<AppItemModel>(this.appItemsList);
        
        this.groupList = [...new Set(this.appItemsList.map(item => item.appropriationName))];

        this.filteredClass = this.formControlClass.valueChanges.pipe(
          startWith(''),
          map(value => this._filterClass(value || '')),
        );

        // var itemTypesApp = [...new Set(this.appItemsList.map(item => item.typeId))];
        // var itemTypes: Group[] = [];
        // itemTypes = this.groupTypeTemp
        // .map(group => ({ id: group.id, description: group.description, type: this._filterType(group.type, itemTypesApp) }))
        // .filter(group => group.type.length > 0);

        // this.groupTypeTemp = itemTypes;

        // this.filteredGroupType = this.formControlType.valueChanges.pipe(
        //   startWith(''),
        //   map(value => this.filterGroup(value || '')),
        // );
      }
    });
  }

  formatAppItems(items: AppItemModel[]): AppItemModel[] {
    items.forEach((itm) => {
      var itemBalance: number = itm.pr_qty;
      var pr_qty: number = 0;
      
      if (itemBalance > 0) {
        itemBalance = itemBalance - itm.first_qtr_qty;
        pr_qty = itm.first_qtr_qty;
        itm.first_qtr_qty = itemBalance >= 0 ? 0 : (pr_qty - itm.pr_qty);

        itm.first_qtr_amt = itm.first_qtr_qty * itm.price;
      }
      
      if (itemBalance > 0) {
        itemBalance = itemBalance - itm.second_qtr_qty;
        pr_qty = pr_qty + itm.second_qtr_qty;
        itm.second_qtr_qty = itemBalance >= 0 ? 0 : (itm.second_qtr_qty - (pr_qty - itm.pr_qty));

        itm.second_qtr_amt = itm.second_qtr_qty * itm.price;
      }
      
      if (itemBalance > 0) {
        itemBalance = itemBalance - itm.third_qtr_qty;
        pr_qty = pr_qty + itm.third_qtr_qty;
        itm.third_qtr_qty = itemBalance >= 0 ? 0 : (itm.third_qtr_qty - (pr_qty - itm.pr_qty));

        itm.third_qtr_amt = itm.third_qtr_qty * itm.price;
      }
      
      if (itemBalance > 0) {
        itemBalance = itemBalance - itm.fourth_qtr_qty;
        pr_qty = pr_qty + itm.fourth_qtr_qty;
        itm.fourth_qtr_qty = itemBalance >= 0 ? 0 : (itm.fourth_qtr_qty - (pr_qty - itm.pr_qty));

        itm.fourth_qtr_amt = itm.fourth_qtr_qty * itm.price;
      }
    });
    return items;
  }

  _filterType(opt: Type[], itemTypesApp: string[]): Type[] {
    return opt.filter(item => itemTypesApp.find(x => x == item.id));
  }

  saveSelectedDialog() {
    if (this.firstQtrChk == false && this.secondQtrChk == false && this.thirdQtrChk == false && this.fourthQtrChk == false) {
      this.notifService.showNotification(NotificationType.error, "Please select quarter.");
      return;
    }

    if (this.selectedItemClass == "") {
      this.notifService.showNotification(NotificationType.error, "Please select account.");
      return;
    }

    if (this.selection.selected.length == 0) {
      this.notifService.showNotification(NotificationType.error, "Please select item/s.");
      return;
    }

    var sofs: number[] = [];
    var accounts: Accounts[];
    var itemsSelected: PurchaseRequestItemsModel[] = [];
    var itemsTotal: number = 0;
    var errorItems: AppItemModel[] = [];

    errorItems = this.selection.selected.filter(itm => itm.itemId.length < 36);

    if (errorItems.length > 0) {
      this.notifService.showNotification(NotificationType.error, "There is a problem in PPMP entry for: <br><b>" + errorItems[0].itemName + "</b><br> Please contact administrator.");
      return;
    }

    this.selection.selected.forEach((item) => {
      var _qty: number = (this.firstQtrChk ? item.first_qtr_qty : 0) + (this.secondQtrChk ? item.second_qtr_qty : 0) + (this.thirdQtrChk ? item.third_qtr_qty : 0) + (this.fourthQtrChk ? item.fourth_qtr_qty : 0);
      if (!(this.excludeZeroQty && _qty == 0) && item.itemId.length == 36) {
        var _itm: Item = this.listItems.find(_i => _i.id == item.itemId);
        if (_itm?.status == "Active") {
          itemsSelected.push(new PurchaseRequestItemsModel(
            "",
            item.itemId,
            item.itemName,
            item.specification,
            item.typeId || "",
            _qty,
            0,
            0,
            item.uom,
            item.price,
            item.price * _qty,
            "",
            "",
            item.id,
            item.appropriationId
          ));

          itemsTotal += item.price * _qty;
    
          if (sofs.indexOf(item.appropriationId) < 0) {
            sofs.push(item.appropriationId);
          }
        }
      }
    });

    if (itemsSelected.length) {
      if (sofs.length > 0) {
        this.httpRequest.getSourceOfFundByIds(sofs).subscribe((result) => {
          if (result.statusCode == 201) {
            accounts = result.data;

            this.httpRequest.getTotalPOPerDept(this.deptSelected.value, this.dateValue.value.year(), sofs[0].toString()).subscribe((result) => {
              if (result.statusCode == 200) {
                var acc_balance = +accounts[0].amount - (result.data[0][0]?.total || 0);
                
                if (acc_balance - itemsTotal >= 0) {
                  this.dialogRef.close({
                    items: itemsSelected,
                    department: this.deptSelected,
                    sof: this.selectedSOF.text,
                    acc: accounts
                  });
                } else {
                  this.notifService.showNotification(NotificationType.error, "Purchase not allowed. Insufficient account balance.");
                }
                
              } else {
                this.notifService.showNotification(NotificationType.error, "There is a problem in fetching data. Please try again.");
              }
            });
          } else {
            this.notifService.showNotification(NotificationType.error, "There is a problem in fetching data. Please try again.");
          }
        });
      } else {
        this.notifService.showNotification(NotificationType.error, "Cannot load items in this transaction. No Source Of Fund.");
      }
    } else {
      this.notifService.showNotification(NotificationType.error, "Item/s selected is/are deleted in Item Setup. Please select another item/s.");
    }
  }

  public calculateTotal(qtr?: number) {
    switch (qtr) {
      case 1:
        return this.appItems?.data?.reduce((accum, curr) => accum + +curr.first_qtr_amt, 0);
        break;
      case 2:
        return this.appItems?.data?.reduce((accum, curr) => accum + +curr.second_qtr_amt, 0);
        break;
      case 3:
        return this.appItems?.data?.reduce((accum, curr) => accum + +curr.third_qtr_amt, 0);
        break;
      case 4:
        return this.appItems?.data?.reduce((accum, curr) => accum + +curr.fourth_qtr_amt, 0);
        break;
      default:
        return this.appItems?.data?.reduce((accum, curr) => accum + +curr.total, 0);
        break;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
