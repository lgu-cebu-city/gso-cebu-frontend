import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PropertyAccountabilityItemModel } from 'src/app/data-model/property-accountability-item-model';
import { PropertyAccountabilityModel } from 'src/app/data-model/property-accountability-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { PropertyAccountabilitySlipComponent } from '../property-accountability-slip.component';

@Component({
  selector: 'app-property-accountability-slip-list',
  templateUrl: './property-accountability-slip-list.component.html',
  styleUrls: ['./property-accountability-slip-list.component.css']
})
export class PropertyAccountabilitySlipListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'requestorName', 'approvedByName', 'dateFrom', 'dateTo', 'requestType', 'purpose', 'remarks', 'action'];
  displayedColumnsNoAction: string[] = ['transactionNo', 'transactionDate', 'requestorName', 'approvedByName', 'dateFrom', 'dateTo', 'requestType', 'purpose', 'remarks'];
  pasList: PropertyAccountabilityModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description'];
  itemDetails: PropertyAccountabilityItemModel[] = [];
  dataSource: MatTableDataSource<PropertyAccountabilityModel> = new MatTableDataSource<PropertyAccountabilityModel>(this.pasList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedPAS: PropertyAccountabilityModel;
  selectedPASItemsPrint: PropertyAccountabilityItemModel[] = [];
  filterDate: Date = null;
  module = this;

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    public dialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.commonFunction.createFn = this.createFn;
    this.commonFunction.editFn = this.editFn;
    this.commonFunction.deleteFn = this.deleteFn;
    this.commonFunction.printFn = this.printFn;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
    this.commonFunction.dialog = this.dialog;
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
          this.loadItemsForPrint(this.pasList[0].items);
        }
      }
    });
  }

  loadItemsForPrint(items: PropertyAccountabilityItemModel[]) {
    this.selectedPASItemsPrint = [];
    for (var i = 0; i < 15; i++) {
      var item: PropertyAccountabilityItemModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new PropertyAccountabilityItemModel(
          "",
          0,
          "",
          "***Nothing Follows***",
          "",
          "",
          "",
          ""
        );
      } else {
        item = new PropertyAccountabilityItemModel(
          "",
          0,
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }
      this.selectedPASItemsPrint.push(item);
    }
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
    this.loadItemsForPrint(row.items);
  }

  viewData(data: any) {
    this.router.navigate(["/property-accountability-slip", { id: data.id }]);
  }

  printData(index: number){
    this.selectedPAS = this.pasList[index];
    this.loadItemsForPrint(this.pasList[index].items);
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  formatNumber(value: any): string {
    return value.toFixed(2);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  createFn() {
    const dialogRef = this.dialog.open(PropertyAccountabilitySlipComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(PropertyAccountabilitySlipComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedPAS
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    console.log("Purchase Request : Delete button clicked!");
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
