import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from 'src/app/data-model/item';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { FundListDialogComponent } from '../../project-proposal/fund-list-dialog/fund-list-dialog.component';
import { DialogData } from '../acceptance-and-inspection-report.component';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';

@Component({
  selector: 'app-list-item-dialog',
  templateUrl: './list-item-dialog.component.html',
  styleUrls: ['./list-item-dialog.component.css']
})
export class ListItemDialogComponent implements OnInit {
  displayedColumns: string[] = ['code', 'description', 'uom'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
  selectedItem: Item;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<FundListDialogComponent>,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
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
    this.httpRequest.getListItemByCategoryType(this.data.itemCategory, this.data.itemType).subscribe((result) => {
      if (result.statusCode == 200) {
        this.dataSource = new MatTableDataSource<Item>(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.data.currentItemId) {
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

  rowSelected(row: Item) {
    this.selectedItem = row;
  }

  selectItem() {
    if (this.selectedItem.status == 'Locked') {
      this.notifService.showNotification(NotificationType.error, "Selected item is locked!");
      return;
    }
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
