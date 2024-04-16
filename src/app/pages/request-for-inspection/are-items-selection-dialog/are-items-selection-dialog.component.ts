import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AreItemsViewModel } from 'src/app/data-model/are-items-view-model';
import { Item } from 'src/app/data-model/item';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { FundListDialogComponent } from '../../project-proposal/fund-list-dialog/fund-list-dialog.component';
import { DialogData } from '../request-for-inspection.component';

@Component({
  selector: 'app-are-items-selection-dialog',
  templateUrl: './are-items-selection-dialog.component.html',
  styleUrls: ['./are-items-selection-dialog.component.css']
})
export class AreItemsSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['propertyNo', 'brand', 'uom', 'parNo', 'departmentName'];
  dataSource: MatTableDataSource<AreItemsViewModel> = new MatTableDataSource<AreItemsViewModel>([]);
  selectedItem: AreItemsViewModel;
  
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
    if (this.data?.department) {
      this.httpRequest.getAllAcknowledgmentReceiptOfEquipmentItemsByDept(this.data.department).subscribe((result) => {
        if (result.statusCode == 200) {
          this.dataSource = new MatTableDataSource<AreItemsViewModel>(result.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.data?.currentItemId) {
            this.selectedItem = result.data.find((itm: Item) => itm.id == this.data.currentItemId)
          } else {
            this.selectedItem = result.data[0];
          }
        }
      });
    } else {
      this.httpRequest.getAllAcknowledgmentReceiptOfEquipmentItems().subscribe((result) => {
        if (result.statusCode == 200) {
          this.dataSource = new MatTableDataSource<AreItemsViewModel>(result.data);
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

  rowSelected(row: AreItemsViewModel) {
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
