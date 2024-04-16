import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { Type } from 'src/app/data-model/type';
import { DialogData } from '../../purchase-request.component';

@Component({
  selector: 'app-pr-list-items',
  templateUrl: './pr-list-items.component.html',
  styleUrls: ['./pr-list-items.component.css']
})
export class PrListItemsComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['no','description', 'quantity', 'uom', 'cost', 'total'];
  itemDetails: MatTableDataSource<PurchaseRequestItemsModel> = new MatTableDataSource<PurchaseRequestItemsModel>([]);
  itemTextFilterStr: string = "";
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PrListItemsComponent>,
  ) { }

  ngOnInit(): void {
    var _prItems: PurchaseRequestItemsModel[] = this.cloneItemsForPrint(this.data.selectedData.items);
    var typeTemp: string[] = [...new Set(_prItems.map(item => item.typeId))];
    var itemsTemp: PurchaseRequestItemsModel[] = [];
    typeTemp.forEach((_type) => {
      itemsTemp.push(new PurchaseRequestItemsModel(
        "0",
        "",
        this.data.typeList.find((type) => type.id == _type)?.description || "Unknown Item Type",
        "",
        "",
        0,
        0,
        0,
        "",
        0,
        0,
        "",
        "",
        0
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

    this.itemDetails = new MatTableDataSource<PurchaseRequestItemsModel>(itemsTemp);
  }

  cloneItemsForPrint(items: PurchaseRequestItemsModel[]): PurchaseRequestItemsModel[] {
    var _retItems: PurchaseRequestItemsModel[] = [];

    items.forEach(_item => {
      _retItems.push(new PurchaseRequestItemsModel(
        _item.id,
        _item.itemId,
        _item.description,
        _item.specification,
        _item.typeId,
        _item.quantity,
        _item.dbmQty,
        _item.callOutQty,
        _item.uom,
        _item.cost,
        _item.total,
        _item.remarks,
        _item.consPrId,
        _item.appId,
        _item.accId,
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
