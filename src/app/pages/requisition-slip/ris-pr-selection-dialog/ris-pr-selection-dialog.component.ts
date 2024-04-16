import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { DialogData } from '../requisition-slip.component';
import { PurchaseRequestIssuanceItemsModel } from 'src/app/data-model/purchase-request-issuance-items-model';
import { SelectionModel } from '@angular/cdk/collections';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';
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
  selector: 'app-ris-pr-selection-dialog',
  templateUrl: './ris-pr-selection-dialog.component.html',
  styleUrls: ['./ris-pr-selection-dialog.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class RisPrSelectionDialogComponent implements OnInit {
  displayedColumnsPR: string[] = ['prNo','prDate','departmentName','sourceOfFund','rationale'];
  displayedColumnsPRSOF: string[] = ['year', 'sofDescription', 'amount'];
  displayedColumnsPRItemDetails: string[] = ['description', 'quantity', 'uom', 'cost', 'check'];
  prList: PurchaseRequestModel[] = [];
  dataSource: MatTableDataSource<PurchaseRequestModel> = new MatTableDataSource<PurchaseRequestModel>(this.prList);
  itemDetails: PurchaseRequestIssuanceItemsModel[];
  selection = new SelectionModel<PurchaseRequestIssuanceItemsModel>(true, []);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedPR: PurchaseRequestModel;
  dateValue = new FormControl(moment());
  textFilterStr: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private httpRequest: HttpRequestService,
    public router: Router,
    private notifService : NotificationService,
    private dialogRef: MatDialogRef<RisPrSelectionDialogComponent>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  }

  loadData() {
    this.textFilterStr = "";
    this.httpRequest.getAllPurchaseRequestWithIssuanceByDepartment(this.data.deptSelected).subscribe((result) => {
      if (result.statusCode == 200) {
        this.prList = result.data.filter((pr: PurchaseRequestModel) => pr.issuanceItems.length > 0);
        this.dataSource = new MatTableDataSource<PurchaseRequestModel>(this.prList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.prList.length) {
          this.selectedPR = this.prList[0];
          this.itemDetails = this.prList[0].issuanceItems;
          this.itemDetails.forEach(row => this.selection.select(row));
        } else {
          this.selectedPR = null;
          this.itemDetails = [];
        }
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.itemDetails.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.itemDetails.forEach(row => this.selection.select(row));
  }

  rowSelected(row: PurchaseRequestModel) {
    this.selectedPR = row;
    this.itemDetails = row.issuanceItems;

    if (this.selectedPR != row) {
      this.itemDetails.forEach(row => this.selection.select(row));
    }
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
  
  selectPR() {
    if (this.selection.selected.length == 0) {
      this.notifService.showNotification(NotificationType.error, "Please select Item/s.");
      return;
    }

    var retItems: RequisitionAndIssuanceItemModel[] = [];

    this.selection.selected.forEach(item => {
      var retItem = new RequisitionAndIssuanceItemModel(
        "",
        item.itemId,
        "",
        "",
        item.uom,
        item.description,
        item.quantity,
        item.uom,
        item.quantity,
        "",
        item.itemId,
        item.typeId,
        item.cost,
        "",
        item.id
      );

      retItems.push(retItem);
    });

    this.dialogRef.close(
      {
        retItems
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
