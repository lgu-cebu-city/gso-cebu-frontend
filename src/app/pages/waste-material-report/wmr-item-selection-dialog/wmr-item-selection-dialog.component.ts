import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AreIcsItemsViewModel } from 'src/app/data-model/are-ics-items-view-model';
import { Item } from 'src/app/data-model/item';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { FundListDialogComponent } from '../../project-proposal/fund-list-dialog/fund-list-dialog.component';
import { DialogData } from '../waste-material-report.component';

@Component({
  selector: 'app-wmr-item-selection-dialog',
  templateUrl: './wmr-item-selection-dialog.component.html',
  styleUrls: ['./wmr-item-selection-dialog.component.css']
})
export class WmrItemSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['brand', 'uom', 'transactionNo', 'type', 'departmentName'];
  dataSource: MatTableDataSource<AreIcsItemsViewModel> = new MatTableDataSource<AreIcsItemsViewModel>([]);
  selectedItem: AreIcsItemsViewModel;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<FundListDialogComponent>,
    private httpRequest: HttpRequestService
  ) {
    dialogRef.disableClose = true;
  }
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    this.httpRequest.getWmrPostRepairByDept(this.data.department).subscribe((result) => {
      if (result.statusCode == 200) {
        this.dataSource = new MatTableDataSource<AreIcsItemsViewModel>(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.data?.currentItemId) {
          this.selectedItem = result.data.find((itm: Item) => itm.id == this.data.currentItemId)
        } else {
          this.selectedItem = result.data[0];
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectedItem = this.dataSource.filteredData[0];
  }

  rowSelected(row: AreIcsItemsViewModel) {
    this.selectedItem = row;
  }

  selectItem() {
    this.dialogRef.close(
      {
        selectedItem: this.selectedItem
      }
    );
  }

  addNewItem() {
    this.dialogRef.close(
      {
        isAddItem: true
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
