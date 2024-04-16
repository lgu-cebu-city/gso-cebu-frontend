import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PreRepairInspectionItemsModel } from 'src/app/data-model/pre-repair-inspection-items-model';
import { PreRepairInspectionModel } from 'src/app/data-model/pre-repair-inspection-model';
import { HttpRequestService } from 'src/app/services/http-request.service';

@Component({
  selector: 'app-pri-selection-dialog',
  templateUrl: './pri-selection-dialog.component.html',
  styleUrls: ['./pri-selection-dialog.component.css']
})
export class PriSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['transactionNo','transactionDate','vehicleName','vehicleType','plateNo','brandModel','engineNo','chassisNo','acquisationDate','acquisationCost','lastRepairDate','lastRepairNature','defectComplaints','workScope','requestedByName','inspectedBy1Name','inspectedBy2Name','notedByName'];
  displayedColumnsItemDetails: string[] = ['description', 'uom', 'quantity'];
  priList: PreRepairInspectionModel[] = [];
  dataSource: MatTableDataSource<PreRepairInspectionModel> = new MatTableDataSource<PreRepairInspectionModel>(this.priList);
  itemDetails: PreRepairInspectionItemsModel[];
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  selectedPri: PreRepairInspectionModel;
  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    private dialogRef: MatDialogRef<PriSelectionDialogComponent>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.httpRequest.getAllPreRepairInspection().subscribe((result) => {
      if (result.statusCode == 200) {
        this.priList = result.data;
        this.dataSource = new MatTableDataSource<PreRepairInspectionModel>(this.priList);
        this.selectedPri = this.priList[0];
        this.itemDetails = this.priList[0].items;
      }
    });
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;
    var filterDate: string = event.value?.toLocaleDateString() || "";
    
    if (filterDate != "") {
      this.dataSource = new MatTableDataSource<PreRepairInspectionModel>(this.priList.filter(
           e => this.datepipe.transform(e.transactionDate.toString(), 'MMM d, yyyy') == this.datepipe.transform(filterDate, 'MMM d, yyyy')));
    } else {
      this.dataSource = new MatTableDataSource<PreRepairInspectionModel>(this.priList);
    }
    
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  rowSelected(row: PreRepairInspectionModel) {
    this.selectedPri = row;
    this.itemDetails = row.items;
  }

  formatNumber(value: any): string {
    return value.toFixed(2);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
  
  selectPP() {
    this.dialogRef.close(
      {
        preRepairInspection: this.selectedPri
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
