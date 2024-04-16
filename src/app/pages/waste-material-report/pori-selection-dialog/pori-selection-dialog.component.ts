import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PostRepairInspectionItemsModel } from 'src/app/data-model/post-repair-inspection-items-model';
import { PostRepairInspectionModel } from 'src/app/data-model/post-repair-inspection-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { DialogData } from '../waste-material-report.component';

@Component({
  selector: 'app-pori-selection-dialog',
  templateUrl: './pori-selection-dialog.component.html',
  styleUrls: ['./pori-selection-dialog.component.css']
})
export class PoriSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo','transactionDate','vehicleName','vehicleType','plateNo','brandModel','engineNo','chassisNo','departmentName','divisionName','remarks','signatory1Name','signatory2Name','acceptedByName'];
  priList: PostRepairInspectionModel[] = [];
  displayedColumnsItemDetails: string[] = ['description', 'uom', 'quantity', 'cost', 'total', 'check'];
  itemDetails: PostRepairInspectionItemsModel[] = [];
  dataSource: MatTableDataSource<PostRepairInspectionModel> = new MatTableDataSource<PostRepairInspectionModel>(this.priList);
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  selectedPri: PostRepairInspectionModel;
  filterDate: Date = null;
  selection = new SelectionModel<PostRepairInspectionItemsModel>(true, []);
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private httpRequest: HttpRequestService,
    public router: Router,
    private dialogRef: MatDialogRef<PoriSelectionDialogComponent>,
    private notifService : NotificationService,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.httpRequest.getAllPostRepairInspectionForWaste().subscribe((result) => {
      if (result.statusCode == 200) {
        this.priList = result.data;
        this.priList = this.priList.filter((data) => data.departmentId == this.data.department);
        this.dataSource = new MatTableDataSource<PostRepairInspectionModel>(this.priList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.priList.length) {
          this.selectedPri = this.priList[0];
          this.itemDetails = this.priList[0].itemsForWaste;
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
      this.selectedPri = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].itemsForWaste;
    } else {
      this.selectedPri = null;
      this.itemDetails = [];
    }
  }

  clearDate() {
    this.filterDate = null;
    var currTextFilter = this.dataSource.filter;
    this.dataSource = new MatTableDataSource<PostRepairInspectionModel>(this.priList);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedPri = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].itemsForWaste;
    } else {
      this.selectedPri = null;
      this.itemDetails = [];
    }
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;

    var data = this.priList.filter(x => this.datepipe.transform(x.transactionDate, 'MMM d, yyyy') == this.datepipe.transform(event.value, 'MMM d, yyyy'))
    
    this.dataSource = new MatTableDataSource<PostRepairInspectionModel>(data);
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.filteredData.length) {
      this.selectedPri = this.dataSource.filteredData[0];
      this.itemDetails = this.dataSource.filteredData[0].itemsForWaste;
    } else {
      this.selectedPri = null;
      this.itemDetails = [];
    }
  }

  rowSelected(row: PostRepairInspectionModel) {
    this.selectedPri = row;
    this.itemDetails = row.itemsForWaste;
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
  
  selectPRI() {
    if (this.selection.selected.length == 0) {
      this.notifService.showNotification(NotificationType.error, "Please select Item/s.");
      return;
    }
    this.selectedPri.items = [];
    this.selection.selected.forEach((item) => {
      this.selectedPri.items.push(item);
    });
    this.dialogRef.close(
      {
        pri: this.selectedPri
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
