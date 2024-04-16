import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseOrderItemModel } from 'src/app/data-model/purchase-order-item-model';
import { DialogData } from '../purchase-order-list.component';

@Component({
  selector: 'app-po-list-items',
  templateUrl: './po-list-items.component.html',
  styleUrls: ['./po-list-items.component.css']
})
export class PoListItemsComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['no','description', 'remarks', 'quantity', 'uom', 'cost', 'total'];
  itemDetails: MatTableDataSource<PurchaseOrderItemModel> = new MatTableDataSource<PurchaseOrderItemModel>([]);
  itemTextFilterStr: string = "";
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PoListItemsComponent>,
  ) { }

  ngOnInit(): void {
    var _prItems: PurchaseOrderItemModel[] = this.cloneItemsForPrint(this.data.selectedData.items);
    var typeTemp: string[] = [...new Set(_prItems.map(item => item.typeId))];
    var itemsTemp: PurchaseOrderItemModel[] = [];
    typeTemp.forEach((_type) => {
      itemsTemp.push(new PurchaseOrderItemModel(
        "0",
        "",
        this.data.typeList.find((type) => type.id == _type)?.description || "Unknown Item Type",
        "",
        "",
        0,
        0,
        0,
        "",
        "",
      ));
      itemsTemp.push(... _prItems.filter(_item => _item.typeId == _type));
    });

    var ctr: number = 1;
    itemsTemp.forEach(_item => {
      if (_item.id != '0') {
        _item.id = ctr.toString();
        ctr += 1;
      }
    });

    this.itemDetails = new MatTableDataSource<PurchaseOrderItemModel>(itemsTemp);
  }

  cloneItemsForPrint(items: PurchaseOrderItemModel[]): PurchaseOrderItemModel[] {
    var _retItems: PurchaseOrderItemModel[] = [];

    items.forEach(_item => {
      _retItems.push(new PurchaseOrderItemModel(
        _item.id,
        _item.itemId,
        _item.description,
        _item.specification,
        _item.uom,
        _item.quantity,
        _item.cost,
        _item.total,
        _item.remarks,
        _item.typeId,
      ));
    });

    return _retItems;
  }

  textFilterItem(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.itemDetails.filter = filterValue;
  }

  public calculateTotal() {
    return this.itemDetails?.data?.reduce((accum, curr) => accum + curr.total, 0);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
