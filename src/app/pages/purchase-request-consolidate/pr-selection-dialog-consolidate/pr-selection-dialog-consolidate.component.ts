import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { ProjectProposalSOFModel } from 'src/app/data-model/project-proposal-sof-model';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
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
  selector: 'app-pr-selection-dialog-consolidate',
  templateUrl: './pr-selection-dialog-consolidate.component.html',
  styleUrls: ['./pr-selection-dialog-consolidate.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PrSelectionDialogConsolidateComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  selection = new SelectionModel<PurchaseRequestModel>(true, []);
  displayedColumns: string[] = ['logs','prNo','prDate', 'prAmount', 'budget', 'departmentName', 'sourceOfFund', 'accounts', 'rationale'];
  displayedColumnsItemDetails: string[] = ['description', 'quantity', 'uom', 'cost', 'total', 'remarks'];
  prList: PurchaseRequestModel[] = [];
  itemDetails: PurchaseRequestItemsModel[] = [];
  dataSource: MatTableDataSource<PurchaseRequestModel> = new MatTableDataSource<PurchaseRequestModel>(this.prList);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
  selectedPR: PurchaseRequestModel;
  dateValue = new FormControl(moment());
  textFilterStr: string = "";
  dateFilterType: string = "Quarter";
  dateFrom: Date = new Date();
  dateTo: Date =  new Date();
  qtrFilter: string = "";
  qtrYearFilter: string = (new Date).getFullYear().toString();
  qtrYearSelection: string[] = [];
  
  formControlClass = new FormControl('');
  selectedItemClass: string = "";
  filteredClass: Observable<string[]>;
  groupList: string[] = [];

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    private notifService : NotificationService,
    private dialogRef: MatDialogRef<PrSelectionDialogConsolidateComponent>,
  ) { }

  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.setQuarter(new Date());
    const ctrlValue = this.dateValue.value;
    ctrlValue.year((new Date()).getFullYear());
    ctrlValue.month((new Date()).getMonth());
    this.dateValue.setValue(ctrlValue);

    for (var i = 2022; i <= (new Date).getFullYear(); i ++) {
      this.qtrYearSelection.push(i.toString());
    }

    this.loadData();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
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

  loadData() {
    this.textFilterStr = "";
    switch (this.dateFilterType) {
      case "Monthly":
        this.httpRequest.getAllPurchaseRequestForConsoByMonthYear(this.datepipe.transform(this.dateValue.value.toDate(), 'yyyy-MM-dd')).subscribe((result) => {
          if (result.statusCode == 200) {
            this.formatData(result.data);
          }
        });
        break;
      case "DateRange":
        this.httpRequest.getAllPurchaseRequestForConsoByDateRange(this.datepipe.transform(this.dateFrom, 'yyyy-MM-dd'), this.datepipe.transform(this.dateTo, 'yyyy-MM-dd')).subscribe((result) => {
          if (result.statusCode == 200) {
            this.formatData(result.data);
          }
        });
        break;
      case "Quarter":
        this.httpRequest.getAllPurchaseRequestForConsoByQuarter(this.qtrFilter, this.qtrYearFilter).subscribe((result) => {
          if (result.statusCode == 200) {
            this.formatData(result.data);
          }
        });
        break
    }
  }

  formatData(data: PurchaseRequestModel[]) {
    this.prList = data;
    this.dataSource = new MatTableDataSource<PurchaseRequestModel>(this.prList);
    if (this.prList.length) {
      this.selectedPR = this.prList[0];
      this.itemDetails = this.prList[0].items;
    } else {
      this.selectedPR = null;
      this.itemDetails = [];
    }

    this.groupList = [];
    this.prList.forEach(_pr => {
      _pr.sof.forEach(_sof => {
        if (!this.groupList.find(_g => _g.trim() == _sof.sofDescription.trim())) {
          this.groupList.push(_sof.sofDescription);
        }
      });
    });

    var sortedGroup: string[] = this.groupList.sort((n1,n2) => {
      if (n1 > n2) { return 1; }
      if (n1 < n2) { return -1; }
      return 0;
    });

    this.groupList = sortedGroup;

    this.filteredClass = this.formControlClass.valueChanges.pipe(
      startWith(''),
      map(value => this._filterClass(value || '')),
    );
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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
    this.selection.clear();
    if (this.selectedItemClass != "") {
      var _filterdTrans = this.prList.filter(_trans => _trans.sof.find(_acc => _acc.sofDescription == this.selectedItemClass));
      this.dataSource = new MatTableDataSource<PurchaseRequestModel>(_filterdTrans);
    } else {
      this.dataSource = new MatTableDataSource<PurchaseRequestModel>(this.prList);
    }
  }

  rowSelected(row: PurchaseRequestModel) {
    this.selectedPR = row;
    this.itemDetails = row.items;
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
    this.loadData();
  }

  selectDateRange() {
    this.loadData();
  }

  selectQtr() {
    this.loadData();
  }

  selectPRs() {
    if (this.selection.selected.length < 2) {
      this.notifService.showNotification(NotificationType.error, "Selection must be more than 1 to consolidate.");
      return;
    }
    this.dialogRef.close({
      prSelected: this.selection.selected
    });
  }

  public calculateTotal() {
    return this.itemDetails?.reduce((accum, curr) => accum + curr.total, 0);
  }

  public calculatePRItemsTotal(_items: PurchaseRequestItemsModel[]) {
    return _items.reduce((accum, curr) => accum + curr.total, 0);
  }

  public calculateAccountTotal(_sofs: ProjectProposalSOFModel[]) {
    return _sofs.reduce((accum, curr) => accum + curr.amount, 0);
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

  closeDialog() {
    this.dialogRef.close();
  }
}
