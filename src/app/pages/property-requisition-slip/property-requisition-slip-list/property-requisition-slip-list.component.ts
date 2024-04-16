import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PropertyRequisitionItemModel } from 'src/app/data-model/property-requisition-item-model';
import { PropertyRequisitionModel } from 'src/app/data-model/property-requisition-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { PropertyRequisitionSlipComponent } from '../property-requisition-slip.component';

@Component({
  selector: 'app-property-requisition-slip-list',
  templateUrl: './property-requisition-slip-list.component.html',
  styleUrls: ['./property-requisition-slip-list.component.css']
})
export class PropertyRequisitionSlipListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'requestorName', 'preparedByName', 'dateFrom', 'dateTo', 'purpose', 'remarks', 'action'];
  displayedColumnsNoAction: string[] = ['transactionNo', 'transactionDate', 'requestorName', 'preparedByName', 'dateFrom', 'dateTo', 'purpose', 'remarks'];
  prsList: PropertyRequisitionModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description'];
  itemDetails: PropertyRequisitionItemModel[] = [];
  dataSource: MatTableDataSource<PropertyRequisitionModel> = new MatTableDataSource<PropertyRequisitionModel>(this.prsList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedPRQ: PropertyRequisitionModel;
  selectedPRQItemsPrint: PropertyRequisitionItemModel[] = [];
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
    this.httpRequest.getAllPropertyRequisition().subscribe((result) => {
      if (result.statusCode == 200) {
        this.prsList = result.data;
        this.dataSource = new MatTableDataSource<PropertyRequisitionModel>(this.prsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.prsList.length) {
          this.selectedPRQ = this.prsList[0];
          this.itemDetails = this.prsList[0]?.items;
          this.loadItemsForPrint(this.prsList[0].items);
        }
      }
    });
  }

  loadItemsForPrint(items: PropertyRequisitionItemModel[]) {
    this.selectedPRQItemsPrint = [];
    for (var i = 0; i < 15; i++) {
      var item: PropertyRequisitionItemModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new PropertyRequisitionItemModel(
          "",
          "",
          "",
          "***Nothing Follows***",
          "",
          "",
          ""
        );
      } else {
        item = new PropertyRequisitionItemModel(
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        );
      }
      this.selectedPRQItemsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedPRQ = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPRQ = null;
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
      this.selectedPRQ = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPRQ = null;
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
      this.selectedPRQ = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPRQ = null;
      this.itemDetails = [];
    }
  }

  rowSelected(row: PropertyRequisitionModel) {
    this.selectedPRQ = row;
    this.itemDetails = row.items;
    this.loadItemsForPrint(row.items);
  }

  viewData(data: any) {
    this.router.navigate(["/property-requisition-slip", { id: data.id }]);
  }

  printData(index: number){
    this.selectedPRQ = this.prsList[index];
    this.loadItemsForPrint(this.prsList[index].items);
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
    const dialogRef = this.dialog.open(PropertyRequisitionSlipComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(PropertyRequisitionSlipComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedPRQ
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
