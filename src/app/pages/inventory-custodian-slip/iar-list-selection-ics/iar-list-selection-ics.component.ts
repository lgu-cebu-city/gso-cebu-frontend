import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AcceptanceAndInspectionReportItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-items-model';
import { AcceptanceAndInspectionReportModel } from 'src/app/data-model/acceptance-and-inspection-report-model';
import { HttpRequestService } from 'src/app/services/http-request.service';

@Component({
  selector: 'app-iar-list-selection-ics',
  templateUrl: './iar-list-selection-ics.component.html',
  styleUrls: ['./iar-list-selection-ics.component.css']
})
export class IarListSelectionIcsComponent implements OnInit {
  displayedColumns: string[] = ['referenceNo', 'referenceDate', 'invoiceNo', 'invoiceDate', 'poNo', 'poDate', 'departmentName', 'supplierName', 'supplierAddress', 'purpose'];
  iarList: AcceptanceAndInspectionReportModel[] = [];
  displayedColumnsItemDetails: string[] = ['description', 'brand', 'uom', 'receivedQuantity', 'serialNo', 'check'];
  itemDetails: AcceptanceAndInspectionReportItemsModel[] = [];
  dataSource: MatTableDataSource<AcceptanceAndInspectionReportModel> = new MatTableDataSource<AcceptanceAndInspectionReportModel>(this.iarList);
  selectedIar: AcceptanceAndInspectionReportModel;
  selectedIarItemsPrint: AcceptanceAndInspectionReportItemsModel[] = [];
  datepipe: DatePipe = new DatePipe('en-US');
  filterDate: Date = null;
  selection = new SelectionModel<AcceptanceAndInspectionReportItemsModel>(true, []);
  
  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    private dialogRef: MatDialogRef<IarListSelectionIcsComponent>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.httpRequest.getAllAcceptanceAndInspectionReportICS().subscribe((result) => {
      if (result.statusCode == 200) {
        this.iarList = result.data;
        this.dataSource = new MatTableDataSource<AcceptanceAndInspectionReportModel>(this.iarList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.iarList.length) {
          this.selectedIar = this.iarList[0];
          this.itemDetails = this.iarList[0].itemsView;
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
      this.selectedIar = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].itemsView;
    } else {
      this.selectedIar = null;
      this.itemDetails = [];
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<AcceptanceAndInspectionReportModel>(this.iarList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedIar = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].itemsView;
    } else {
      this.selectedIar = null;
      this.itemDetails = [];
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.iarList.filter(x => this.datepipe.transform(x.referenceDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<AcceptanceAndInspectionReportModel>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedIar = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].itemsView;
    } else {
      this.selectedIar = null;
      this.itemDetails = [];
    }
  }

  rowSelected(row: AcceptanceAndInspectionReportModel) {
    this.selectedIar = row;
    this.itemDetails = row.itemsView;
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
  
  selectIAR() {
    this.selectedIar.items = [];
    this.selection.selected.forEach((item) => {
      this.selectedIar.items.push(item);
    });
    this.dialogRef.close(
      {
        iar: this.selectedIar
      }
    );
  }

  selectIARItem(item: AcceptanceAndInspectionReportItemsModel) {
     var selIar: AcceptanceAndInspectionReportModel;
     selIar = this.selectedIar;
     selIar.items = [item];

     this.dialogRef.close(
      {
        iar: this.selectedIar
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
