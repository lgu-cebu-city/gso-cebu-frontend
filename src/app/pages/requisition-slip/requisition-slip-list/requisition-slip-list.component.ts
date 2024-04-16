import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';
import { RequisitionAndIssuanceModel } from 'src/app/data-model/requisition-and-issuance-model';
import { AuthService } from 'src/app/services/auth.service';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { RequisitionSlipComponent } from '../requisition-slip.component';

@Component({
  selector: 'app-requisition-slip-list',
  templateUrl: './requisition-slip-list.component.html',
  styleUrls: ['./requisition-slip-list.component.css']
})
export class RequisitionSlipListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'saiNo', 'saiDate', 'division', 'departmentName', 'purpose', 'action'];
  displayedColumnsNoAction: string[] = ['transactionNo', 'transactionDate', 'saiNo', 'saiDate', 'division', 'departmentName', 'purpose'];
  risList: RequisitionAndIssuanceModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description', 'requestedQty'];
  itemDetails: RequisitionAndIssuanceItemModel[] = [];
  dataSource: MatTableDataSource<RequisitionAndIssuanceModel> = new MatTableDataSource<RequisitionAndIssuanceModel>(this.risList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedIssuance: RequisitionAndIssuanceModel;
  selectedIssuanceItemsPrint: RequisitionAndIssuanceItemModel[] = [];
  filterDate: Date = null;
  module = this;

  constructor(
    private authService: AuthService,
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    private notifService : NotificationService,
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
    if (this.authService.getTypeId() == environment.gsoDeptId.toString()) {
      this.httpRequest.getAllRequisitionAndIssuanceByTransType("Requested Issuance").subscribe((result) => {
        if (result.statusCode == 200) {
          this.risList = result.data;
          this.dataSource = new MatTableDataSource<RequisitionAndIssuanceModel>(this.risList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.risList.length) {
            this.selectedIssuance = this.risList[0];
            this.itemDetails = this.risList[0]?.items;
            this.loadItemsForPrint(this.risList[0].items);
          } else {
            this.selectedIssuance = null;
            this.itemDetails = [];
          }
        }
      });
    } else {
      this.httpRequest.getAllRequisitionAndIssuanceByDepartmentByTransType("Requested Issuance", this.authService.getTypeId()).subscribe((result) => {
        if (result.statusCode == 200) {
          this.risList = result.data;
          this.dataSource = new MatTableDataSource<RequisitionAndIssuanceModel>(this.risList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.risList.length) {
            this.selectedIssuance = this.risList[0];
            this.itemDetails = this.risList[0]?.items;
            this.loadItemsForPrint(this.risList[0].items);
          } else {
            this.selectedIssuance = null;
            this.itemDetails = [];
          }
        }
      });
    }
  }

  loadItemsForPrint(items: RequisitionAndIssuanceItemModel[]) {
    this.selectedIssuanceItemsPrint = [];
    for (var i = 0; i < 15; i++) {
      var item: RequisitionAndIssuanceItemModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new RequisitionAndIssuanceItemModel(
          "",
          "",
          "",
          "",
          "",
          "***Nothing Follows***",
          0,
          "",
          0,
          "",
          "",
          "",
          0,
          "",
        );
      } else {
        item = new RequisitionAndIssuanceItemModel(
          "",
          "",
          "",
          "",
          "",
          "",
          0,
          "",
          0,
          "",
          "",
          "",
          0,
          "",
        );
      }
      this.selectedIssuanceItemsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedIssuance = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedIssuance = null;
      this.itemDetails = [];
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<RequisitionAndIssuanceModel>(this.risList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedIssuance = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedIssuance = null;
      this.itemDetails = [];
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.risList.filter(x => this.datepipe.transform(x.transactionDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<RequisitionAndIssuanceModel>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedIssuance = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedIssuance = null;
      this.itemDetails = [];
    }
  }

  rowSelected(row: RequisitionAndIssuanceModel) {
    this.selectedIssuance = row;
    this.itemDetails = row.items;
    this.loadItemsForPrint(row.items);
  }

  viewData(data: any) {
    this.router.navigate(["/requisition-slip", { id: data.id }]);
  }

  printData(index: number){
    this.selectedIssuance = this.risList[index];
    this.loadItemsForPrint(this.risList[index].items);
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
    const dialogRef = this.dialog.open(RequisitionSlipComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(RequisitionSlipComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedIssuance
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    this.module.httpRequest.deleteRequisitionAndIssuance(this.module.selectedIssuance.id).subscribe((result) => {
      if (result.statusCode == 200) {
        this.module.notifService.showNotification(NotificationType.success, "Successfully deleted!");
        this.module.loadData();
      } else {
        this.module.notifService.showNotification(NotificationType.error, "Delete Data Failed!");
      }
    });
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
