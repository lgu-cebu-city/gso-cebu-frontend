import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { AppItemModel } from 'src/app/data-model/app-item-model';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { map, Observable, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { Department } from 'src/app/data-model/department';
import { MatSelectChange } from '@angular/material/select';
import { environment } from 'src/environments/environment';
import { Type } from 'src/app/data-model/type';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

interface AppPrItems {
  appId: number,
  appropriationName: string,
  itemId: string,
  itemName: string,
  qty: number,
  uom: string,
  price: number,
  total: number,
  typeId: string,
  first_qtr_qty: number,
  first_qtr_amt: number,
  first_qtr_pr: number,
  second_qtr_qty: number,
  second_qtr_amt: number,
  second_qtr_pr: number,
  third_qtr_qty: number,
  third_qtr_amt: number,
  third_qtr_pr: number,
  fourth_qtr_qty: number,
  fourth_qtr_amt: number,
  fourth_qtr_pr: number,
  pr_qty: number,
  pr_amt: number,
}

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
  selector: 'app-app-monitoring-report',
  templateUrl: './app-monitoring-report.component.html',
  styleUrls: ['./app-monitoring-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AppMonitoringReportComponent implements OnInit {
  env = environment;
  displayedColumns: string[] = ['no','itemName','uom','qty','price','total','first_qtr_qty','first_qtr_pr','second_qtr_qty','second_qtr_pr','third_qtr_qty','third_qtr_pr','fourth_qtr_qty','fourth_qtr_pr','prQty','prAmt'];
  appItems: MatTableDataSource<AppPrItems> = new MatTableDataSource<AppPrItems>([]);
  departmentSelection: Department[] = [];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  dateValue = new FormControl(moment());
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  appItemsList: AppItemModel[] = [];
  prItemsList: PurchaseRequestItemsModel[] = [];
  appPRItemsList: AppPrItems[] = [];
  isLoading: boolean = false;
  
  formControl = new FormControl('');
  typeList: Type[] = [];
  typeSelected: { value: string; text: string } = {value: "", text: ""};
  filteredType: Observable<Type[]>;
  
  defaultDept: string;
  account: number = 0;

  excludeZeroQty: boolean = false;

  constructor(
    public authService: AuthService,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadDepartment();
    this.loadAPPItems();
    this.loadPRItems();
  }
  
  loadDepartment() {
    this.departmentSelection = this.authService.listDepartment;

    if (this.departmentSelection.length) {
      var deptx: Department = this.departmentSelection.find(d => d.id == this.authService.getTypeId());
      this.deptSelected = {value: deptx.id, text: deptx.name};
      this.defaultDept = this.authService.getTypeId();
    }
  }

  deptSelectedValue(event: MatSelectChange) {
    this.appItems = new MatTableDataSource<AppPrItems>([]);
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
    this.defaultDept = event.value;

    this.loadAPPItems();
    this.loadPRItems();
  }

  private _filter(value: string): Type[] {
    const filterValue = value.toLowerCase();

    return this.typeList.filter(option => option.description.toLowerCase().startsWith(filterValue));
  }

  setYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    var d = normalizedMonthAndYear.toString();
    var dateVal = new Date(d);
    const ctrlValue = this.dateValue.value;
    ctrlValue.year(dateVal.getFullYear());
    this.dateValue.setValue(ctrlValue);
    datepicker.close();
  }

  loadAPPItems() {
    this.isLoading = true;
    this.httpRequest.getAllAPPItems(this.dateValue.value.year(), this.defaultDept, this.account).subscribe((result) => {
      if (result.statusCode == 200) {
        if (result.data.length == 0) {
          this.notifService.showNotification(NotificationType.info, "No data found.");
          this.isLoading = false;
        }
        this.appItemsList = result.data;
        
        this.formatAppPrItems();
      } else {
        this.isLoading = false;
      }
    });
  }

  loadPRItems() {
    this.isLoading = true;
    this.httpRequest.getAllPurchaseRequestItemsByDeptYear(this.defaultDept, this.dateValue.value.year()).subscribe((result) => {
      if (result.statusCode == 200) {
        if (result.data.length == 0) {
          this.notifService.showNotification(NotificationType.info, "No data found.");
          this.isLoading = false;
        }
        this.prItemsList = result.data;
        
        this.formatAppPrItems();
      } else {
        this.isLoading = false;
      }
    });
  }

  formatAppPrItems() {
    if (this.appItemsList.length > 0 && this.prItemsList.length > 0) {
      var items: AppPrItems[] = [];
      this.appItemsList.forEach(_appItem => {
        var _prItems: PurchaseRequestItemsModel[] = [];
        _prItems = this.prItemsList.filter(_prItm => _prItm.appId == _appItem.id);

        var _appPrItem: AppPrItems = {
          appId: _appItem.id,
          appropriationName: _appItem.appropriationName,
          itemId: _appItem.itemId,
          itemName: _appItem.itemName,
          qty: _appItem.qty,
          uom: _appItem.uom,
          price: _appItem.price,
          total: _appItem.total,
          typeId: _appItem.typeId,
          first_qtr_qty: _appItem.first_qtr_qty,
          first_qtr_amt: _appItem.first_qtr_amt,
          first_qtr_pr: _prItems.filter((i) => i.prQtr == "Q1").reduce((accum, curr) => accum + +curr.quantity, 0),
          second_qtr_qty: _appItem.second_qtr_qty,
          second_qtr_amt: _appItem.second_qtr_amt,
          second_qtr_pr: _prItems.filter((i) => i.prQtr == "Q2").reduce((accum, curr) => accum + +curr.quantity, 0),
          third_qtr_qty: _appItem.third_qtr_qty,
          third_qtr_amt: _appItem.third_qtr_amt,
          third_qtr_pr: _prItems.filter((i) => i.prQtr == "Q3").reduce((accum, curr) => accum + +curr.quantity, 0),
          fourth_qtr_qty: _appItem.fourth_qtr_qty,
          fourth_qtr_amt: _appItem.fourth_qtr_amt,
          fourth_qtr_pr: _prItems.filter((i) => i.prQtr == "Q4").reduce((accum, curr) => accum + +curr.quantity, 0),
          pr_qty: _prItems.reduce((accum, curr) => accum + +curr.quantity, 0),
          pr_amt: _prItems.reduce((accum, curr) => accum + +curr.total, 0),
        };

        items.push(_appPrItem);
      });
      this.formatListItems(items);
    }
  }

  formatListItems(_items: AppPrItems[]) {
    this.httpRequest.getItemType().subscribe((result) => {
      if (result.statusCode == 200) {
        var itemTypeList: Type[] = result.data;

        var accountTemp: string[] = [...new Set(_items.map(item => item.appropriationName))];
        var itemsTemp: AppPrItems[] = [];
        accountTemp.forEach((_acc) => {
          itemsTemp.push({
            appId: 0,
            appropriationName: "",
            itemId: "",
            itemName: _acc,
            qty: 0,
            uom: "",
            price: 0,
            total: 0,
            typeId: _acc,
            first_qtr_qty: 0,
            first_qtr_amt: 0,
            first_qtr_pr: 0,
            second_qtr_qty: 0,
            second_qtr_amt: 0,
            second_qtr_pr: 0,
            third_qtr_qty: 0,
            third_qtr_amt: 0,
            third_qtr_pr: 0,
            fourth_qtr_qty: 0,
            fourth_qtr_amt: 0,
            fourth_qtr_pr: 0,
            pr_qty: 0,
            pr_amt: 0,
          })
          itemsTemp.push(... _items.filter(_item => _item.appropriationName == _acc));
        });

        var ctr: number = 1;
        itemsTemp.forEach(_item => {
          if (_item.appId != 0) {
            _item.appId = ctr;
            ctr += 1;
          }
        });

        this.appPRItemsList = itemsTemp;
        this.appItems = new MatTableDataSource<AppPrItems>(itemsTemp);
        var itemTypesApp = [...new Set(_items.map(item => item.typeId))];
        this.typeList = itemTypeList.filter(_type => itemTypesApp.find(x => x == _type.id));

        this.filteredType = this.formControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );

        this.isLoading = false;
      }
    });
  }

  selectionChanged(event: MatAutocompleteSelectedEvent) {
    this.typeSelected = {
      value: event.option.value,
      text: this.typeList.find(_type => _type.id == event.option.value).description
    };
    var items: AppPrItems[] = [];
    items = this.appPRItemsList.filter((app) => app.typeId == this.typeSelected.value);
    this.appItems = new MatTableDataSource<AppPrItems>(items);
  }

  clearFilter() {
    this.typeSelected = {
      value: "",
      text: ""
    };
    var items: AppPrItems[] = [];
    items = this.appPRItemsList;
    this.appItems = new MatTableDataSource<AppPrItems>(items);
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.appItems.filter = filterValue;
  }

  public calculateTotal() {
    return this.appItems?.data?.reduce((accum, curr) => accum + +curr.total, 0);
  }

  public calculateTotalPR() {
    return this.appItems?.data?.reduce((accum, curr) => accum + +curr.pr_amt, 0);
  }

}
