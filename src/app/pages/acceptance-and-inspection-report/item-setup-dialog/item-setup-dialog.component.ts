import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Item } from 'src/app/data-model/item';
import { Group } from 'src/app/data-model/group';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { FundListDialogComponent } from '../../project-proposal/fund-list-dialog/fund-list-dialog.component';
import { DialogData } from '../acceptance-and-inspection-report.component';
import { Type } from 'src/app/data-model/type';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface ItemModel {
  id: string,
  code: string,
  description: string,
  uom: string,
  groupId: string,
  typeId: string,
  category: string
}

@Component({
  selector: 'app-item-setup-dialog',
  templateUrl: './item-setup-dialog.component.html',
  styleUrls: ['./item-setup-dialog.component.css']
})
export class ItemSetupDialogComponent implements OnInit {
  displayedColumns: string[] = ['code', 'description', 'uom', 'typedesc', 'groupdesc', 'action'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
  selectedItem: Item;
  typeSelection: Type[] = [];
  typeSelectionFiltered: Type[] = [];
  groupSelection: Group[] = [];
  nextIndex: number = 0
  isProcessing: boolean = false;
  
  itemId: string = "";
  code: string = "";
  description: string = "";
  uom: string = "";
  type: string = "";
  group: string = "";
  category: string = "";
  btnSaveText: string = "Save";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<FundListDialogComponent>,
    public router: Router, 
    private notifService: NotificationService,
    private httpRequest: HttpRequestService
  ) {
    dialogRef.disableClose = true;
  }
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.category = this.data.itemCategory;
    this.uom = this.data.itemUom;
    this.getTransactionNo();
  }

  async ngAfterViewInit() {
    this.loadSelectionData();
    this.loadData();
  }

  getTransactionNo() {
    var _prefix: string = this.category == "Generic"? "IG-": "ING-";
    this.httpRequest.getItemTransactionNo(_prefix).subscribe((result) => {
      if (result.statusCode == 200) {
        this.code = result.data[0].transactionNo;
      }
    });
  }

  loadData() {
    if (this.data.itemType) {
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
    } else {
      this.httpRequest.getListItemByCategory(this.data.itemCategory).subscribe((result) => {
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
  }

  loadSelectionData() {
    this.httpRequest.getItemGroupWithType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.groupSelection = result.data;

        var group = this.groupSelection.find(g => g.type.find(t => t.id == this.data.itemType));
        this.group = group.id;
        this.typeSelectionFiltered = this.groupSelection.find(g => g.id == this.group).type;
        this.type = this.data.itemType;
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
  }

  categorySelectedValue(event: MatSelectChange) {
    this.getTransactionNo();
  }

  typeSelectedValue(event: MatSelectChange) {
    this.typeSelectionFiltered = this.groupSelection.find(g => g.id == event.value).type;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.description == this.data.itemDescription) {
      msg = "Item discription already exist";
    }
    if (!this.code) {
      msg = "Please input Item Code";
    }
    if (!this.description) {
      msg = "Please input Description";
    }
    if (!this.uom) {
      msg = "Please input Unit of Measurement";
    }
    if (!this.group) {
      msg = "Please select Item Group";
    }
    if (!this.type) {
      msg = "Please select Item Type";
    }
    if (!this.category) {
      msg = "Please select Item Category";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    var isDataValid = this.isEntryValid();
    
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      this.isProcessing = false;
      return;
    }
    var itm: ItemModel = {
      id: this.itemId,
      code: this.code,
      description: this.description,
      uom: this.uom,
      groupId: this.group,
      typeId: this.type,
      category: this.category
    };

    if (this.btnSaveText == "Save") {
      this.httpRequest.addItem(itm).subscribe((result) => {
        this.clear();
        this.loadData();
        this.notifService.showNotification(NotificationType.success, "Successfully saved!");
      });
    } else if (this.btnSaveText == "Update") {
      this.httpRequest.updateItem(this.itemId, itm).subscribe((result) => {
        this.clear();
        this.loadData();
        this.notifService.showNotification(NotificationType.success, "Successfully updated!");
      });
    }
    this.isProcessing = false;
  }

  editData(item: Item) {
    this.itemId = item.id.toString();
    this.code = item.code.toString();
    this.description = item.description.toString();
    this.uom = item.uom.toString();
    this.group = item.groupId.toString();
    this.typeSelectionFiltered = this.groupSelection.find(g => g.id == this.group).type;
    this.type = item.typeId.toString();
    this.category = item.category.toString();
    this.btnSaveText = "Update";
  }

  deleteData(item: Item) {

  }
  
  clear() {
    this.itemId = "";
    this.code = "";
    this.description = "";
    this.uom = "";
    this.category = this.data.itemCategory;
    this.btnSaveText = "Save";
    this.getTransactionNo();
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

  closeDialog() {
    this.dialogRef.close();
  }

}
