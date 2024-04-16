import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Group } from 'src/app/data-model/group';
import { Item } from 'src/app/data-model/item';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { FundListDialogComponent } from '../../project-proposal/fund-list-dialog/fund-list-dialog.component';

@Component({
  selector: 'app-tw-item-selection-dialog',
  templateUrl: './tw-item-selection-dialog.component.html',
  styleUrls: ['./tw-item-selection-dialog.component.css']
})
export class TwItemSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['item', 'code', 'description', 'uom', 'quantity'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
  listItemData: Item[] = [];
  selectedItem: Item;
  groupType: Group[];
  itemType: string = "All";
  excludeZeroQty: boolean = false;
  
  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<FundListDialogComponent>,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
  ) {
    dialogRef.disableClose = true;
  }
  
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadGroupType();
    this.loadData();
  }

  async ngAfterViewInit() {
    
  }

  loadData() {
    if (this.itemType == "All") {
      this.httpRequest.getListItemByCategoryAllTypeDepartment("Generic", this.authService.getTypeId()).subscribe((result) => {
        if (result.statusCode == 200) {
          this.listItemData = result.data;
          this.displayData();
        }
      });
    } else {
      this.httpRequest.getListItemByCategoryTypeDepartment("Generic", this.itemType, this.authService.getTypeId()).subscribe((result) => {
        if (result.statusCode == 200) {
          this.listItemData = result.data;
          this.displayData();
        }
      });
    }
  }

  displayData() {
    this.dataSource = new MatTableDataSource<Item>(this.listItemData);
    this.dataSource.sort = this.sort;
    this.selectedItem = this.listItemData[0];
  }

  excludeZeroCheckChanged() {
    if (this.excludeZeroQty) {
      var newData: Item[] = this.listItemData.filter(itm => itm.quantity > 0);
      this.dataSource = new MatTableDataSource<Item>(newData);
    } else {
      this.dataSource = new MatTableDataSource<Item>(this.listItemData);
    }
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
    if (!this.selectedItem) {
      this.notifService.showNotification(NotificationType.error, "No Item Selected!");
      return;
    }
    if (this.selectedItem.quantity > 0) {
      this.dialogRef.close(
        {
          selectedItem: this.selectedItem,
        }
      );
    } else {
      this.notifService.showNotification(NotificationType.error, "Selected item has 0 quantity!");
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
