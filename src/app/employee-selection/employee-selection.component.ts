import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { DialogData } from '../pages/purchase-request/purchase-request.component';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../util/notification_type';

@Component({
  selector: 'app-employee-selection',
  templateUrl: './employee-selection.component.html',
  styleUrls: ['./employee-selection.component.css']
})
export class EmployeeSelectionComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  employeeList: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(this.employeeList);
  selectedEmployee: any;

  isViewAll: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
    public router: Router,
    private dialogRef: MatDialogRef<EmployeeSelectionComponent>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    if (this.data.defaultEmployees && this.data.defaultEmployees.length > 0) {
      this.isViewAll = false;
    }

    this.loadData();
  }

  loadData() {
    if (this.isViewAll) {
      this.employeeList = this.data.employees;
    } else {
      this.employeeList = this.data.defaultEmployees;
    }
    
    this.dataSource = new MatTableDataSource<any>(this.employeeList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.employeeList.length) {
      this.selectedEmployee = this.employeeList[0];
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length) {
      this.selectedEmployee = this.dataSource.filteredData[0];
    } else {
      this.selectedEmployee = null;
    }
  }

  rowSelected(row: any) {
    this.selectedEmployee = row;
  }
  
  selectEmployee() {
    this.dialogRef.close(
      {
        employee: this.selectedEmployee
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
