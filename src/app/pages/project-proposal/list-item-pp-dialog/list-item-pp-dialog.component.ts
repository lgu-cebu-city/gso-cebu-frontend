import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Group } from 'src/app/data-model/group';
import { Item } from 'src/app/data-model/item';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { FundListDialogComponent } from '../../project-proposal/fund-list-dialog/fund-list-dialog.component';
import { DialogData } from '../project-proposal.component';

@Component({
  selector: 'app-list-item-pp-dialog',
  templateUrl: './list-item-pp-dialog.component.html',
  styleUrls: ['./list-item-pp-dialog.component.css']
})
export class ListItemPpDialogComponent implements OnInit {
  displayedColumns: string[] = ['code', 'description', 'uom'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
  selectedItem: Item;
  groupType: Group[];
  itemType: string = "";
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<FundListDialogComponent>,
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
