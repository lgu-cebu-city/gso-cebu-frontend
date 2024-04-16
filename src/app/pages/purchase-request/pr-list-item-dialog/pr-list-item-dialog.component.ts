import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Group } from 'src/app/data-model/group';
import { Item } from 'src/app/data-model/item';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { DialogData } from '../purchase-request.component';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';

@Component({
  selector: 'app-pr-list-item-dialog',
  templateUrl: './pr-list-item-dialog.component.html',
  styleUrls: ['./pr-list-item-dialog.component.css']
})
export class PrListItemDialogComponent implements OnInit {
  displayedColumns: string[] = ['code', 'description', 'uom'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
  selectedItem: Item;
  groupType: Group[];
  itemType: string = "";
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PrListItemDialogComponent>,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
  ) {
    dialogRef.disableClose = true;
  }
  
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadGroupType();

    this.itemType = this.data.selectedTypeId;

    if (this.data.selectedTypeId) {
      this.loadData();
    }
  }

  async ngAfterViewInit() {
    
  }

  loadData() {
    this.httpRequest.getListItemByCategoryType(this.data.itemCategory, this.itemType).subscribe((result) => {
      if (result.statusCode == 200) {
        this.dataSource = new MatTableDataSource<Item>(result.data);
        this.dataSource.sort = this.sort;
        this.selectedItem = result.data[0];
      }
    });
  }

  loadGroupType() {
    this.httpRequest.getItemGroupWithType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.groupType = result.data;
      }
    });
  }
  
  typeSelectedValue(event: MatSelectChange) {
    this.loadData();
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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
        selectedItem: this.selectedItem,
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
