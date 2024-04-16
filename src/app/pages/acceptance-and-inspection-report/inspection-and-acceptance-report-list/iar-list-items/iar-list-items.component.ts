import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { Type } from 'src/app/data-model/type';
import { DialogData } from '../../acceptance-and-inspection-report.component';
import { AcceptanceAndInspectionReportItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-items-model';

@Component({
  selector: 'app-iar-list-items',
  templateUrl: './iar-list-items.component.html',
  styleUrls: ['./iar-list-items.component.css']
})
export class IarListItemsComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['no', 'description', 'brand', 'uom', 'quantity', 'receivedQuantity'];
  itemDetails: MatTableDataSource<AcceptanceAndInspectionReportItemsModel> = new MatTableDataSource<AcceptanceAndInspectionReportItemsModel>([]);
  itemTextFilterStr: string = "";
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<IarListItemsComponent>,
  ) { }

  ngOnInit(): void {
    var _prItems: AcceptanceAndInspectionReportItemsModel[] = this.cloneItemsForPrint(this.data.selectedData.items);
    var typeTemp: string[] = [...new Set(_prItems.map(item => item.groupId))];
    var itemsTemp: AcceptanceAndInspectionReportItemsModel[] = [];
    typeTemp.forEach((_type) => {
      itemsTemp.push(new AcceptanceAndInspectionReportItemsModel(
        "0",
        "",
        "",
        "",
        "",
        this.data.typeList.find((type) => type.id == _type)?.description || "Unknown Item Type",
        "",
        "",
        0,
        0,
        0,
        "",
        "",
        null,
        "",
        "",
        "",
        "",
        []
      ));
      itemsTemp.push(... _prItems.filter(_item => _item.groupId == _type));
    });

    var ctr: number = 1;
    itemsTemp.forEach(_item => {
      if (_item.id != '0') {
        _item.id = ctr.toString();
        ctr += 1;
      }
    });

    this.itemDetails = new MatTableDataSource<AcceptanceAndInspectionReportItemsModel>(itemsTemp);
  }

  cloneItemsForPrint(items: AcceptanceAndInspectionReportItemsModel[]): AcceptanceAndInspectionReportItemsModel[] {
    var _retItems: AcceptanceAndInspectionReportItemsModel[] = [];

    items.forEach(_item => {
      _retItems.push(new AcceptanceAndInspectionReportItemsModel(
        _item.id,
        _item.poItemId,
        _item.groupId,
        _item.groupName,
        _item.itemId,
        _item.description,
        _item.specification,
        _item.uom,
        _item.quantity,
        _item.price,
        _item.receivedQuantity,
        _item.brand,
        _item.brandId,
        _item.expirationDate,
        _item.lotNo,
        _item.remarks,
        _item.serialNo,
        _item.model,
        _item.subItems
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

  closeDialog() {
    this.dialogRef.close();
  }
}
