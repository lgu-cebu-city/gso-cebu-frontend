import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RequestForRepairItemModel } from 'src/app/data-model/request-for-repair-item-model';
import { RequestForRepairModel } from 'src/app/data-model/request-for-repair-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { RequestForRepairComponent } from '../request-for-repair.component';
import { RfrRepairResultDialogComponent } from '../rfr-repair-result-dialog/rfr-repair-result-dialog.component';

@Component({
  selector: 'app-request-for-repair-list',
  templateUrl: './request-for-repair-list.component.html',
  styleUrls: ['./request-for-repair-list.component.css']
})
export class RequestForRepairListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'departmentName', 'reason', 'remarks', 'action'];
  displayedColumnsNoAction: string[] = ['transactionNo', 'transactionDate', 'departmentName', 'reason', 'remarks'];
  rfiList: RequestForRepairModel[] = [];
  displayedColumnsItemDetails: string[] = ['description', 'areNo', 'quantity', 'natureOfRequest', 'remarks'];
  itemDetails: RequestForRepairItemModel[] = [];
  dataSource: MatTableDataSource<RequestForRepairModel> = new MatTableDataSource<RequestForRepairModel>(this.rfiList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedRepair: RequestForRepairModel;
  selectedRepairItem: RequestForRepairItemModel;
  selectedRepairItemsPrint: RequestForRepairItemModel[] = [];
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
    this.httpRequest.getAllRequestForRepair().subscribe((result) => {
      if (result.statusCode == 200) {
        this.rfiList = result.data;
        this.dataSource = new MatTableDataSource<RequestForRepairModel>(this.rfiList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.rfiList.length) {
          this.selectedRepair = this.rfiList[0];
          this.itemDetails = this.rfiList[0]?.items;
          if (this.itemDetails.length) {
            this.selectedRepairItem = this.itemDetails[0];
          } else {
            this.selectedRepairItem = null;
          }
          this.loadItemsForPrint(this.rfiList[0].items);
        }
      }
    });
  }

  loadItemsForPrint(items: RequestForRepairItemModel[]) {
    this.selectedRepairItemsPrint = [];
    for (var i = 0; i < 5; i++) {
      var item: RequestForRepairItemModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new RequestForRepairItemModel(
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
        item = new RequestForRepairItemModel(
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
      this.selectedRepairItemsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedRepair = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
      this.selectedRepairItem = this.itemDetails[0];
    } else {
      this.selectedRepair = null;
      this.itemDetails = [];
      this.selectedRepairItem = null;
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<RequestForRepairModel>(this.rfiList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedRepair = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
      this.selectedRepairItem = this.itemDetails[0];
    } else {
      this.selectedRepair = null;
      this.itemDetails = [];
      this.selectedRepairItem = null;
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.rfiList.filter(x => this.datepipe.transform(x.transactionDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<RequestForRepairModel>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedRepair = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
      this.selectedRepairItem = this.itemDetails[0];
    } else {
      this.selectedRepair = null;
      this.itemDetails = [];
      this.selectedRepairItem = null;
    }
  }

  rowSelected(row: RequestForRepairModel) {
    this.selectedRepair = row;
    this.itemDetails = row.items;
    this.selectedRepairItem = this.itemDetails[0];
    this.loadItemsForPrint(row.items);
  }

  rowItemSelected(row: RequestForRepairItemModel) {
    this.selectedRepairItem = row;
  }

  viewData(data: any) {
    this.router.navigate(["/request-for-repair", { id: data.id }]);
  }

  onContextMenu(event: MouseEvent, item: RequestForRepairItemModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  setRepairResult(data: RequestForRepairItemModel) {
    var repResult = data.remarks?.split(" | ")[0];
    var repRemarks = data.remarks?.split(" | ")[1];
    const dialogRef = this.dialog.open(RfrRepairResultDialogComponent, {
      data: {
        repairResult: repResult,
        repairRemarks: repRemarks
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var res: string = "";
        if (result.repairRemarks) {
          res = result.repairResult + " | " + result.repairRemarks;
        } else {
          res = result.repairResult;
        }
        
        this.httpRequest.updateRFRItemRemarks(data.id, res).subscribe((result) => {
          if (result.statusCode == 200) {
            data.remarks = res;
          }
        });
      }
    });
  }

  printData(index: number){
    this.selectedRepair = this.rfiList[index];
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
    const dialogRef = this.dialog.open(RequestForRepairComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(RequestForRepairComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedRepair
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
