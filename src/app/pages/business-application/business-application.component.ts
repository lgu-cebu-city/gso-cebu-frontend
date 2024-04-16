import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { NotificationService } from 'src/app/services/notification.service';
import { BusinessApplicationModel } from 'src/app/data-model/business-application-model';
import { ChangeStatusDialogComponent } from './change-status-dialog/change-status-dialog.component';

export interface DialogData {
  selectedData: BusinessApplicationModel;
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

@Component({
  selector: 'app-business-application',
  templateUrl: './business-application.component.html',
  styleUrls: ['./business-application.component.css']
})
export class BusinessApplicationComponent implements OnInit {
  displayedColumns: string[] = ['transaction_no','application_type','tax_year','business_name','user_name','organization_type','payment_type','application_status','action'];
  businessList: BusinessApplicationModel[] = [];
  dataSource: MatTableDataSource<BusinessApplicationModel> = new MatTableDataSource<BusinessApplicationModel>(this.businessList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  selectedRow: BusinessApplicationModel;
  dateValue = new FormControl(moment());

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

  loadData() {
    this.httpRequest.getBusinessApplication().subscribe((result) => {
      if (result.statusCode == 200) {
        this.businessList = result.data;
        this.dataSource = new MatTableDataSource<BusinessApplicationModel>(this.businessList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.businessList.length) {
          this.selectedRow = this.businessList[0];
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

  rowSelected(row: BusinessApplicationModel) {
    this.selectedRow = row;
  }

  changeStatus(data: BusinessApplicationModel) {
    const dialogRef = this.dialog.open(ChangeStatusDialogComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: data
    }});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }
}
