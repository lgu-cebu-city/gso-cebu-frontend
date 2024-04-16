import { NotificationType } from "src/app/util/notification_type";
import { SelectionModel } from '@angular/cdk/collections';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Accounts } from "src/app/data-model/Accounts";
import { HttpRequestService } from "src/app/services/http-request.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../project-proposal.component";
import { NotificationService } from "src/app/services/notification.service";
import { MatSelectChange } from "@angular/material/select";
import { AuthService } from "src/app/services/auth.service";

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
  selector: 'app-fund-list-dialog',
  templateUrl: './fund-list-dialog.component.html',
  styleUrls: ['./fund-list-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class FundListDialogComponent implements OnInit {
  displayedColumns: string[] = ['check', 'description', 'project'];
  selectedDisplayedColumns: string[] = ['description', 'project', 'action'];
  selection = new SelectionModel<Accounts>(true, []);
  dateValue = new FormControl(moment());
  selectedFund = new MatTableDataSource<Accounts>([]);
  listAccounts: MatTableDataSource<Accounts> = new MatTableDataSource<Accounts>([]);
  selectedSOF: {value: string, text: string} = {value: null, text: ""};
  deptSelected: { value: string; text: string } = {value: "", text: ""};

  public defaultSOF: string;
  public defaultDept: string;
  public defaultFund: number;

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private httpRequest: HttpRequestService,
    private dialogRef: MatDialogRef<FundListDialogComponent>,
    private notifService : NotificationService,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.listAccounts = new MatTableDataSource<Accounts>(this.data.sofData);
    this.selectedFund.data = this.data.selectedFund.slice();
    if (this.selectedFund.data.length > 0) {
      this.defaultDept = this.selectedFund.data[0].officeId;
      this.defaultFund = this.selectedFund.data[0].classificationId;
      this.defaultSOF = this.selectedFund.data[0].fundId.toString();
      this.selectedSOF = {
        value: this.defaultFund.toString(),
        text: this.data.sofList.find((x) => x.id == this.defaultSOF.toString()).SOFName
      };
      this.httpRequest.getFundCategoryByFundId(this.defaultSOF.toString()).subscribe((result) => {
        if (result.statusCode == 200) {
          this.data.catList = result.data;
        }
      });
      this.selectionChanged();
    } else {
      this.defaultDept = this.data.defaultDept || this.authService.getTypeId();
      this.defaultFund = 4;
      this.defaultSOF = "1";
      this.selectedSOF = {
        value: this.defaultFund.toString(),
        text: this.data.sofList.find((x) => x.id == this.defaultSOF.toString()).SOFName
      };
      this.selectionChanged();
    }
    this.httpRequest.getDepartmentById(this.defaultDept).subscribe((result) => {
      if (result.statusCode == 200) {
        this.deptSelected = {value: result.data.id, text: result.data.name};
      }
    });
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.listAccounts.filter = filterValue;
  }

  loadSOFData(sof: string, dept: string, cat: string, year: string) {
    if (sof != "" && dept != "" && cat != "" && year != "") {
      this.httpRequest.getSourceOfFund(sof, dept, cat, year).subscribe((result) => {
        if (result.statusCode == 201) {
          this.data.sofData = result.data;
          this.listAccounts = new MatTableDataSource<Accounts>(this.data.sofData);
        }
      });
    }
  }

  sofSelectionChanged(event: MatSelectChange) {
    this.selectedSOF = {
      value: event.value,
      text: event.source.triggerValue
    };
    this.httpRequest.getFundCategoryByFundId(this.defaultSOF.toString()).subscribe((result) => {
      if (result.statusCode == 200) {
        this.data.catList = result.data;
      }
    });
  }

  selectionChanged() {
    this.loadSOFData(this.defaultSOF.toString(), this.defaultDept, this.defaultFund.toString(), this.dateValue.value.year());
  }

  setYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    var d = normalizedMonthAndYear.toString();
    var dateVal = new Date(d);
    const ctrlValue = this.dateValue.value;
    ctrlValue.year(dateVal.getFullYear());
    this.dateValue.setValue(ctrlValue);
    this.loadSOFData(this.defaultSOF.toString(), this.defaultDept, this.defaultFund.toString(), this.dateValue.value.year());
    datepicker.close();
  }

  addSOF() {
    this.selection.selected.forEach((sof) => {
      if (!this.selectedFund.data.find((a) => a.id == sof.id)) {
        this.selectedFund.data.push(sof);
      }
    });
    this.selection.clear();
    this.refreshTable();
  }

  refreshTable() {
    let cloned = this.selectedFund.data.slice();
    this.selectedFund.data = cloned;
  }

  removeSOF(index: number) {
    this.selectedFund.data.splice(index, 1);
    this.refreshTable();
  }

  saveSelectedDialog() {
    if (this.selectedFund.data.length == 0) {
      this.notifService.showNotification(NotificationType.warning, "Please select Source of Fund!");
    } else {
      if (this.selectedFund.data.join('') == this.data.selectedFund.join('')) {
        this.dialogRef.close();
      } else {
        var result = {
          selectedFund: this.selectedFund.data,
          selectedSOF: this.selectedSOF.text,
          department: this.deptSelected,
        };
        this.dialogRef.close(result);
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
