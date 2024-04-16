import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RequestForInspectionItemModel } from 'src/app/data-model/request-for-inspection-item-model';
import { RequestForInspectionModel } from 'src/app/data-model/request-for-inspection-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { RequestForInspectionComponent } from '../request-for-inspection.component';
import { RfiInspectionResultDialogComponent } from '../rfi-inspection-result-dialog/rfi-inspection-result-dialog.component';

@Component({
  selector: 'app-request-for-inspection-list',
  templateUrl: './request-for-inspection-list.component.html',
  styleUrls: ['./request-for-inspection-list.component.css']
})
export class RequestForInspectionListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'departmentName', 'transactionType', 'remarks', 'actionTaken', 'action'];
  displayedColumnsNoAction: string[] = ['transactionNo', 'transactionDate', 'departmentName', 'transactionType', 'remarks', 'actionTaken'];
  rfiList: RequestForInspectionModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemNo', 'description', 'areNo', 'issue', 'remarks'];
  itemDetails: RequestForInspectionItemModel[] = [];
  dataSource: MatTableDataSource<RequestForInspectionModel> = new MatTableDataSource<RequestForInspectionModel>(this.rfiList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedInspection: RequestForInspectionModel;
  selectedInspectionItem: RequestForInspectionItemModel;
  selectedInspectionItemsPrint: RequestForInspectionItemModel[] = [];
  filterDate: Date = null;
  contextMenuPosition = { x: '0px', y: '0px' };
  module = this;

  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    public dialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
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
    this.httpRequest.getAllRequestForInspection().subscribe((result) => {
      if (result.statusCode == 200) {
        this.rfiList = result.data;
        this.dataSource = new MatTableDataSource<RequestForInspectionModel>(this.rfiList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.rfiList.length) {
          this.selectedInspection = this.rfiList[0];
          this.itemDetails = this.rfiList[0]?.items;
          if (this.itemDetails.length) {
            this.selectedInspectionItem = this.itemDetails[0];
          } else {
            this.selectedInspectionItem = null;
          }
          this.loadItemsForPrint(this.rfiList[0].items);
        }
      }
    });
  }

  loadItemsForPrint(items: RequestForInspectionItemModel[]) {
    this.selectedInspectionItemsPrint = [];
    for (var i = 0; i < 13; i++) {
      var item: RequestForInspectionItemModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new RequestForInspectionItemModel(
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
        item = new RequestForInspectionItemModel(
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
      this.selectedInspectionItemsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedInspection = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
      this.selectedInspectionItem = this.itemDetails[0];
    } else {
      this.selectedInspection = null;
      this.itemDetails = [];
      this.selectedInspectionItem = null;
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<RequestForInspectionModel>(this.rfiList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedInspection = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
      this.selectedInspectionItem = this.itemDetails[0];
    } else {
      this.selectedInspection = null;
      this.itemDetails = [];
      this.selectedInspectionItem = null;
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.rfiList.filter(x => this.datepipe.transform(x.transactionDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<RequestForInspectionModel>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedInspection = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
      this.selectedInspectionItem = this.itemDetails[0];
    } else {
      this.selectedInspection = null;
      this.itemDetails = [];
      this.selectedInspectionItem = null;
    }
  }

  rowSelected(row: RequestForInspectionModel) {
    this.selectedInspection = row;
    this.itemDetails = row.items;
    this.selectedInspectionItem = this.itemDetails[0];
    this.loadItemsForPrint(row.items);
  }

  rowItemSelected(row: RequestForInspectionItemModel) {
    this.selectedInspectionItem = row;
  }

  viewData(data: any) {
    this.router.navigate(["/request-for-inspection", { id: data.id }]);
  }

  onContextMenu(event: MouseEvent, item: RequestForInspectionItemModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  setInspectionResult(data: RequestForInspectionItemModel) {
    var insResult = data.remarks?.split(" | ")[0];
    var insRemarks = data.remarks?.split(" | ")[1];
    const dialogRef = this.dialog.open(RfiInspectionResultDialogComponent, {
      data: {
        inspectionResult: insResult,
        inspectionRemarks: insRemarks
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var res: string = "";
        if (result.inspectionRemarks) {
          res = result.inspectionResult + " | " + result.inspectionRemarks;
        } else {
          res = result.inspectionResult;
        }

        this.httpRequest.updateRFIItemRemarks(data.id, res).subscribe((result) => {
          if (result.statusCode == 200) {
            data.remarks = res;
          }
        });
      }
    });
  }

  printData(index: number){
    this.selectedInspection = this.rfiList[index];
    this.loadItemsForPrint(this.rfiList[index].items);
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
    const dialogRef = this.dialog.open(RequestForInspectionComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(RequestForInspectionComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedInspection
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
