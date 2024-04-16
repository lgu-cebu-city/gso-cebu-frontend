import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RequisitionAndIssuanceItemBatchModel } from 'src/app/data-model/requisition-and-issuance-item-batch-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { FundListDialogComponent } from '../../project-proposal/fund-list-dialog/fund-list-dialog.component';
import { DialogData } from '../issuance-slip.component';

@Component({
  selector: 'app-inventory-item-selection',
  templateUrl: './inventory-item-selection.component.html',
  styleUrls: ['./inventory-item-selection.component.css']
})
export class InventoryItemSelectionComponent implements OnInit {
  displayedColumns: string[] = ['batchNo', 'expirationDate', 'quantity', 'action'];
  dataSource: MatTableDataSource<RequisitionAndIssuanceItemBatchModel> = new MatTableDataSource<RequisitionAndIssuanceItemBatchModel>([]);
  actualDataSource: MatTableDataSource<RequisitionAndIssuanceItemBatchModel> = new MatTableDataSource<RequisitionAndIssuanceItemBatchModel>([]);
  selectedItem: RequisitionAndIssuanceItemBatchModel;
  datepipe: DatePipe = new DatePipe('en-US');
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
    this.loadData();
  }

  loadData() {
    this.httpRequest.getMedicineByBrandId(this.data.selectedItemData.itemId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.dataSource = new MatTableDataSource<RequisitionAndIssuanceItemBatchModel>(result.data);
        this.dataSource.sort = this.sort;
        this.selectedItem = result.data[0];

        const res: RequisitionAndIssuanceItemBatchModel[] = result.data;
        var maxQty = this.data.selectedItemData.issuedQty;
        var curQty = 0;
        for (var i = 0; i < res.length; i++) {
          if (curQty + res[i].quantity >= maxQty) {
            var _item = new RequisitionAndIssuanceItemBatchModel(
              res[i].id,
              res[i].itemId,
              res[i].batchNo,
              res[i].expirationDate,
              maxQty - curQty,
              res[i].remarks
            );
            this.actualDataSource.data.push(_item);
            this.refreshTable();
            break;
          } else {
            var _item = new RequisitionAndIssuanceItemBatchModel(
              res[i].id,
              res[i].itemId,
              res[i].batchNo,
              res[i].expirationDate,
              res[i].quantity,
              res[i].remarks
            );
            this.actualDataSource.data.push(_item);
          }
          curQty += res[i].quantity;
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
    this.selectedItem = this.dataSource.filteredData[0];
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  rowSelected(row: RequisitionAndIssuanceItemBatchModel) {
    this.selectedItem = row;
  }

  addItem(i: number) {
    var currQty: number = 0;
    var reqQty: number = this.data.selectedItemData.issuedQty;
    var selectedItem: RequisitionAndIssuanceItemBatchModel = this.dataSource.data[i];
    this.actualDataSource.data.forEach((item: RequisitionAndIssuanceItemBatchModel) => {
      currQty += item.quantity;
    });
    if (currQty < reqQty) {
      var e = this.actualDataSource.data.find(item => item.batchNo == selectedItem.batchNo);
      if (e) {
        this.notifService.showNotification(NotificationType.error, "Batch item already exist!");
      } else {
        var itm = new RequisitionAndIssuanceItemBatchModel(
          selectedItem.id,
          selectedItem.itemId,
          selectedItem.batchNo,
          selectedItem.expirationDate,
          selectedItem.quantity > (reqQty - currQty) ? reqQty - currQty : selectedItem.quantity,
          selectedItem.remarks
        )
        this.actualDataSource.data.push(itm);
        this.refreshTable();
      }
    } else {
      this.notifService.showNotification(NotificationType.error, "Required quantity already exceed!");
    }
  }

  removeItem(i: number) {
    this.actualDataSource.data.splice(i, 1);
    this.refreshTable();
  }

  refreshTable() {
    let cloned = this.actualDataSource.data.slice();
    this.actualDataSource.data = cloned;
  }

  selectItem() {
    var currQty: number = 0;
    var reqQty: number = this.data.selectedItemData.issuedQty;
    this.actualDataSource.data.forEach((item: RequisitionAndIssuanceItemBatchModel) => {
      currQty += item.quantity;
    });

    if (currQty < reqQty) {
      this.notifService.showNotification(NotificationType.error, "Added Quantity is lesser than the required quantity!");
      return;
    }

    this.data.selectedItemData.itemsDetails = this.actualDataSource.data;
    
    this.dialogRef.close(
      {
        selectedItemData: this.data.selectedItemData,
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
