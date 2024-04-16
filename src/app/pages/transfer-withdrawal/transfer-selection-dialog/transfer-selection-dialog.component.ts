import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';
import { RequisitionAndIssuanceModel } from 'src/app/data-model/requisition-and-issuance-model';
import { AuthService } from 'src/app/services/auth.service';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';
import { TransferWithdrawalComponent } from '../transfer-withdrawal.component';

@Component({
  selector: 'app-transfer-selection-dialog',
  templateUrl: './transfer-selection-dialog.component.html',
  styleUrls: ['./transfer-selection-dialog.component.css']
})
export class TransferSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo', 'transactionDate', 'saiNo', 'saiDate', 'division', 'departmentName', 'purpose'];
  risList: RequisitionAndIssuanceModel[] = [];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description', 'requestedQty', 'issuedQty', 'remarks'];
  itemDetails: RequisitionAndIssuanceItemModel[] = [];
  dataSource: MatTableDataSource<RequisitionAndIssuanceModel> = new MatTableDataSource<RequisitionAndIssuanceModel>(this.risList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedIssuance: RequisitionAndIssuanceModel;
  filterDate: Date = null;

  constructor(
    private authService: AuthService,
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<TransferWithdrawalComponent>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    if (this.authService.getTypeId() == environment.gsoDeptId.toString()) {
      this.httpRequest.getAllRequisitionAndIssuanceByIssuanceType("Transfer Withdrawal").subscribe((result) => {
        if (result.statusCode == 200) {
          this.risList = result.data;
          this.dataSource = new MatTableDataSource<RequisitionAndIssuanceModel>(this.risList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.risList.length) {
            this.selectedIssuance = this.risList[0];
            this.itemDetails = this.risList[0]?.items;
          } else {
            this.selectedIssuance = null;
            this.itemDetails = [];
          }
        }
      });
    } else {
      this.httpRequest.getAllRequisitionAndIssuanceByDepartmentByIssuanceType("Transfer Withdrawal", this.authService.getTypeId()).subscribe((result) => {
        if (result.statusCode == 200) {
          this.risList = result.data;
          this.dataSource = new MatTableDataSource<RequisitionAndIssuanceModel>(this.risList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.risList.length) {
            this.selectedIssuance = this.risList[0];
            this.itemDetails = this.risList[0]?.items;
          } else {
            this.selectedIssuance = null;
            this.itemDetails = [];
          }
        }
      });
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
        selectedIssuance: this.selectedIssuance
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
