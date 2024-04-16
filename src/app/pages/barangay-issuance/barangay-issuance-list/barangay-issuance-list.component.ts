import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BarangayIssuance } from 'src/app/data-model/barangay-issuance-model';
import { BarangayIssuanceItemModel } from 'src/app/data-model/barangay-issuance-item-model';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { BarangayIssuanceComponent } from '../barangay-issuance.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-barangay-issuance-list',
  templateUrl: './barangay-issuance-list.component.html',
  styleUrls: ['./barangay-issuance-list.component.css']
})
export class BarangayIssuanceListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'accountablePersonNameFrom', 'accountablePersonNameTo', 'action'];
  displayedColumnsNoAction: string[] = ['transactionNo', 'transactionDate', 'accountablePersonNameFrom', 'accountablePersonNameTo'];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description', 'issuedQty', 'remarks'];
  briList: BarangayIssuance[] = [];
  itemDetails: BarangayIssuanceItemModel[] = [];
  dataSource: MatTableDataSource<BarangayIssuance> = new MatTableDataSource<BarangayIssuance>(this.briList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedBarangayIssuance: BarangayIssuance;
  selectedBarangayIssuanceItemsPrint: BarangayIssuanceItemModel[] = [];
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
      this.httpRequest.getAllBarangayIssuance().subscribe((result) => {
        if (result.statusCode == 200) {
          this.briList = result.data;
          this.dataSource = new MatTableDataSource<BarangayIssuance>(result.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.dataSource.data.length) {
            this.selectedBarangayIssuance = this.dataSource.data[0];
            this.itemDetails = this.dataSource.data[0]?.items;
            this.loadItemsForPrint(this.dataSource.data[0].items);
          } else {
            this.selectedBarangayIssuance = null;
            this.itemDetails = [];
          }
        }
      });
    } else {
      this.httpRequest.getAllBarangayIssuanceByDepartment(this.authService.getTypeId()).subscribe((result) => {
        if (result.statusCode == 200) {
          this.briList = result.data;
          this.dataSource = new MatTableDataSource<BarangayIssuance>(result.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.dataSource.data.length) {
            this.selectedBarangayIssuance = this.dataSource.data[0];
            this.itemDetails = this.dataSource.data[0]?.items;
            this.loadItemsForPrint(this.dataSource.data[0].items);
          } else {
            this.selectedBarangayIssuance = null;
            this.itemDetails = [];
          }
        }
      });
    }
  }

  loadItemsForPrint(items: BarangayIssuanceItemModel[]) {
    this.selectedBarangayIssuanceItemsPrint = [];
    for (var i = 0; i < 15; i++) {
      var item: BarangayIssuanceItemModel;
      if (items[i]) {
        item = items[i];
      } else if (i == items.length) {
        item = new BarangayIssuanceItemModel(
          "",
          "",
          "",
          "",
          "",
          "***Nothing Follows***",
          0,
          "",
          "",
          "",
          0,
          "",
        );
      } else {
        item = new BarangayIssuanceItemModel(
          "",
          "",
          "",
          "",
          "",
          "",
          0,
          "",
          "",
          "",
          0,
          "",
        );
      }
      this.selectedBarangayIssuanceItemsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedBarangayIssuance = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedBarangayIssuance = null;
      this.itemDetails = [];
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<BarangayIssuance>(this.briList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedBarangayIssuance = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedBarangayIssuance = null;
      this.itemDetails = [];
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.briList.filter(x => this.datepipe.transform(x.transactionDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<BarangayIssuance>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedBarangayIssuance = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].items;
    } else {
      this.selectedBarangayIssuance = null;
      this.itemDetails = [];
    }
  }

  rowSelected(row: BarangayIssuance) {
    this.selectedBarangayIssuance = row;
    this.itemDetails = row.items;
    this.loadItemsForPrint(row.items);
  }

  viewData(data: any) {
    this.router.navigate(["/barangay-issuance", { id: data.id }]);
  }

  printData(index: number){
    this.selectedBarangayIssuance = this.dataSource.data[index];
    this.loadItemsForPrint(this.dataSource.data[index].items);
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
    const dialogRef = this.dialog.open(BarangayIssuanceComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(BarangayIssuanceComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedBarangayIssuance
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    this.module.httpRequest.deleteBarangayIssuance(this.module.selectedBarangayIssuance.id).subscribe((result) => {
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
