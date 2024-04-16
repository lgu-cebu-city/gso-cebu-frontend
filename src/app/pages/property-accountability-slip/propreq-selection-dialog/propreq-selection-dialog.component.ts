import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PropertyRequisitionItemModel } from 'src/app/data-model/property-requisition-item-model';
import { PropertyRequisitionModel } from 'src/app/data-model/property-requisition-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { PropertyAccountabilitySlipComponent } from '../property-accountability-slip.component';

@Component({
  selector: 'app-propreq-selection-dialog',
  templateUrl: './propreq-selection-dialog.component.html',
  styleUrls: ['./propreq-selection-dialog.component.css']
})
export class PropreqSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'requestorName', 'preparedByName', 'dateFrom', 'dateTo', 'purpose', 'remarks'];
  prsList: PropertyRequisitionModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description'];
  itemDetails: PropertyRequisitionItemModel[] = [];
  dataSource: MatTableDataSource<PropertyRequisitionModel> = new MatTableDataSource<PropertyRequisitionModel>(this.prsList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedWMR: PropertyRequisitionModel;
  selectedWMRItemsPrint: PropertyRequisitionItemModel[] = [];
  filterDate: Date = null;

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<PropertyAccountabilitySlipComponent>,
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
    this.httpRequest.getAllPropertyRequisition().subscribe((result) => {
      if (result.statusCode == 200) {
        this.prsList = result.data;
        this.dataSource = new MatTableDataSource<PropertyRequisitionModel>(this.prsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.prsList.length) {
          this.selectedWMR = this.prsList[0];
          this.itemDetails = this.prsList[0]?.items;
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
      this.selectedWMR = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedWMR = null;
      this.itemDetails = [];
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<PropertyRequisitionModel>(this.prsList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedWMR = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedWMR = null;
      this.itemDetails = [];
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.prsList.filter(x => this.datepipe.transform(x.transactionDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<PropertyRequisitionModel>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedWMR = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedWMR = null;
      this.itemDetails = [];
    }
  }

  rowSelected(row: PropertyRequisitionModel) {
    this.selectedWMR = row;
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
        selectedWMR: this.selectedWMR
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
