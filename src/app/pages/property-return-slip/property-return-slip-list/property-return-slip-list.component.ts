import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PropertyReturnItemModel } from 'src/app/data-model/property-return-item-model';
import { PropertyReturnModel } from 'src/app/data-model/property-return-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { PropertyReturnSlipComponent } from '../property-return-slip.component';

@Component({
  selector: 'app-property-return-slip-list',
  templateUrl: './property-return-slip-list.component.html',
  styleUrls: ['./property-return-slip-list.component.css']
})
export class PropertyReturnSlipListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'requestorName', 'receivedByName', 'processedByName', 'returnStatus', 'remarks', 'action'];
  displayedColumnsNoAction: string[] = ['transactionNo', 'transactionDate', 'requestorName', 'receivedByName', 'processedByName', 'returnStatus', 'remarks'];
  pasList: PropertyReturnModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description'];
  itemDetails: PropertyReturnItemModel[] = [];
  dataSource: MatTableDataSource<PropertyReturnModel> = new MatTableDataSource<PropertyReturnModel>(this.pasList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedPRS: PropertyReturnModel;
  selectedPRSItemsPrint: PropertyReturnItemModel[] = [];
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
    this.httpRequest.getAllPropertyReturn().subscribe((result) => {
      if (result.statusCode == 200) {
        this.pasList = result.data;
        this.dataSource = new MatTableDataSource<PropertyReturnModel>(this.pasList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.pasList.length) {
          this.selectedPRS = this.pasList[0];
          this.itemDetails = this.pasList[0]?.items;
          this.loadItemsForPrint(this.pasList[0].items);
        }
      }
    });
  }

  loadItemsForPrint(items: PropertyReturnItemModel[]) {
    this.selectedPRSItemsPrint = [];
    for (var i = 0; i < 8; i++) {
      var item: PropertyReturnItemModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new PropertyReturnItemModel(
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
        item = new PropertyReturnItemModel(
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
      this.selectedPRSItemsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedPRS = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPRS = null;
      this.itemDetails = [];
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<PropertyReturnModel>(this.pasList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedPRS = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPRS = null;
      this.itemDetails = [];
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.pasList.filter(x => this.datepipe.transform(x.transactionDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<PropertyReturnModel>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedPRS = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedPRS = null;
      this.itemDetails = [];
    }
  }

  rowSelected(row: PropertyReturnModel) {
    this.selectedPRS = row;
    this.itemDetails = row.items;
    this.loadItemsForPrint(row.items);
  }

  viewData(data: any) {
    this.router.navigate(["/property-return-slip", { id: data.id }]);
  }

  printData(index: number){
    this.selectedPRS = this.pasList[index];
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
    const dialogRef = this.dialog.open(PropertyReturnSlipComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(PropertyReturnSlipComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedPRS
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
