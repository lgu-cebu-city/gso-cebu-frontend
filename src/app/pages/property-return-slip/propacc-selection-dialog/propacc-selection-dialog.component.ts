import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PropertyAccountabilityItemModel } from 'src/app/data-model/property-accountability-item-model';
import { PropertyAccountabilityModel } from 'src/app/data-model/property-accountability-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { PropertyReturnSlipComponent } from '../property-return-slip.component';

@Component({
  selector: 'app-propacc-selection-dialog',
  templateUrl: './propacc-selection-dialog.component.html',
  styleUrls: ['./propacc-selection-dialog.component.css']
})
export class PropaccSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'requestorName', 'approvedByName', 'dateFrom', 'dateTo', 'requestType', 'purpose', 'remarks'];
  pasList: PropertyAccountabilityModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description'];
  itemDetails: PropertyAccountabilityItemModel[] = [];
  dataSource: MatTableDataSource<PropertyAccountabilityModel> = new MatTableDataSource<PropertyAccountabilityModel>(this.pasList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedPAS: PropertyAccountabilityModel;
  selectedPASItemsPrint: PropertyAccountabilityItemModel[] = [];
  filterDate: Date = null;

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<PropertyReturnSlipComponent>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.httpRequest.getAllPropertyAccountability().subscribe((result) => {
      if (result.statusCode == 200) {
        this.pasList = result.data;
        this.dataSource = new MatTableDataSource<PropertyAccountabilityModel>(this.pasList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.pasList.length) {
          this.selectedPAS = this.pasList[0];
          this.itemDetails = this.pasList[0]?.items;
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

    if (this.dataSource.filteredData.length) {
      this.selectedPAS = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPAS = null;
      this.itemDetails = [];
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<PropertyAccountabilityModel>(this.pasList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedPAS = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPAS = null;
      this.itemDetails = [];
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.pasList.filter(x => this.datepipe.transform(x.transactionDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<PropertyAccountabilityModel>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedPAS = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPAS = null;
      this.itemDetails = [];
    }
  }

  rowSelected(row: PropertyAccountabilityModel) {
    this.selectedPAS = row;
    this.itemDetails = row.items;
  }

  formatNumber(value: any): string {
    return value.toFixed(2);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
  
  selectIssuance() {
    this.dialogRef.close(
      {
        selectedPAS: this.selectedPAS
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
