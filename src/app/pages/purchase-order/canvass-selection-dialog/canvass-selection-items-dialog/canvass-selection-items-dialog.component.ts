import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AbstractOfCanvassItemModel } from 'src/app/data-model/abstract-of-canvass-item-model';
import { DialogData } from '../canvass-selection-dialog.component';

@Component({
  selector: 'app-canvass-selection-items-dialog',
  templateUrl: './canvass-selection-items-dialog.component.html',
  styleUrls: ['./canvass-selection-items-dialog.component.css']
})
export class CanvassSelectionItemsDialogComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['no','description', 'remarks', 'quantity', 'uom', 'cost', 'total'];
  itemDetails: MatTableDataSource<AbstractOfCanvassItemModel> = new MatTableDataSource<AbstractOfCanvassItemModel>([]);
  itemTextFilterStr: string = "";
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<CanvassSelectionItemsDialogComponent>,
  ) { }

  ngOnInit(): void {
    var _prItems: AbstractOfCanvassItemModel[] = this.cloneItemsForPrint(this.data.selectedData.items);
    var typeTemp: string[] = [...new Set(_prItems.map(item => item.typeId))];
    var itemsTemp: AbstractOfCanvassItemModel[] = [];
    typeTemp.forEach((_type) => {
      itemsTemp.push(new AbstractOfCanvassItemModel(
        "0",
        "",
        this.data.typeList.find((type) => type.id == _type)?.description || "Unknown Item Type",
        "",
        "",
        0,
        "",
        0,
        0,
        0,
        "",
        false,
        false,
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

    this.itemDetails = new MatTableDataSource<AbstractOfCanvassItemModel>(itemsTemp);
  }

  cloneItemsForPrint(items: AbstractOfCanvassItemModel[]): AbstractOfCanvassItemModel[] {
    var _retItems: AbstractOfCanvassItemModel[] = [];

    items.forEach(_item => {
      _retItems.push(new AbstractOfCanvassItemModel(
        _item.id,
        _item.itemId,
        _item.description,
        _item.specification,
        _item.uom,
        _item.quantity,
        _item.typeId,
        _item.price,
        _item.priceRead,
        _item.priceCalculated,
        _item.remarks,
        _item.awarded,
        _item.approved,
        _item.total,
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
    return this.itemDetails?.data?.reduce((accum, curr) => accum + (curr.priceRead * curr.quantity), 0);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
