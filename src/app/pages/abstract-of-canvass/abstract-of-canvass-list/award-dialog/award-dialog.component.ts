import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractOfCanvassItemModel } from 'src/app/data-model/abstract-of-canvass-item-model';
import { RequestQuotationItemsModel } from 'src/app/data-model/request-quotation-items-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { DialogData, SupplierItems } from '../abstract-of-canvass-list.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-award-dialog',
  templateUrl: './award-dialog.component.html',
  styleUrls: ['./award-dialog.component.css']
})
export class AwardDialogComponent implements OnInit {
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  displayedColumns: string[] = [
    'description',
    'uom',
    'quantity',
    'supplier1Selected',
    'supplier1Qty',
    'supplier1Price',
    'supplier2Selected',
    'supplier2Qty',
    'supplier2Price',
    'supplier3Selected',
    'supplier3Qty',
    'supplier3Price'
  ];
  dataSource = new MatTableDataSource<SupplierItems>([]);
  approveSupp1: boolean = false;
  approveSupp2: boolean = false;
  approveSupp3: boolean = false;
  selectAllSupp1: boolean = false;
  selectAllSupp2: boolean = false;
  selectAllSupp3: boolean = false;
  formTitle: string = "";
  textFilterStr: string = "";
  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private httpRequest: HttpRequestService,
    private dialogRef: MatDialogRef<AwardDialogComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.getItems();

    switch (this.data.action) {
      case "Award":
        this.formTitle = "Award Supplier";
        break;
      case "Approve":
        this.formTitle = "Approve Awarded Supplier";
        break;
      case "Decline":
        this.formTitle = "Decline Awarded Supplier";
        break;
      default:
        break;
    }
  }

  getItems() {
    this.isLoading = true;
    var rfqID = this.data.abstractOfCanvass.rfqId;
    this.httpRequest.getRequestQuotationItems(rfqID).subscribe((result) => {
      if (result.statusCode == 200) {
        var _rfqItems: RequestQuotationItemsModel[] = result.data;
        
        _rfqItems.forEach(_item => {
          if (_item.quantity > 0) {
            var _itemTemp: SupplierItems = {
              itemId: "",
              description: "",
              specification: "",
              uom: "",
              quantity: 0,
              price: 0,
              typeId: "",
              supplier1Selected: false,
              supplier1Id: "",
              supplier1Name: "",
              supplier1Qty: 0,
              supplier1Price: 0,
              supplier2Selected: false,
              supplier2Id: "",
              supplier2Name: "",
              supplier2Qty: 0,
              supplier2Price: 0,
              supplier3Selected: false,
              supplier3Id: "",
              supplier3Name: "",
              supplier3Qty: 0,
              supplier3Price: 0,
            };
  
            _itemTemp.itemId = _item.itemId;
            _itemTemp.description = _item.description;
            _itemTemp.specification = _item.specification;
            _itemTemp.uom = _item.uom;
            _itemTemp.quantity = _item.quantity;
            _itemTemp.price = _item.cost;
            _itemTemp.typeId = _item.typeId;
  
            if (this.data.abstractOfCanvass.supplier[0]) {
              var _supp1Item: AbstractOfCanvassItemModel = this.data.abstractOfCanvass.supplier[0].items.find(_suppItem => _suppItem.itemId == _item.itemId);
              _itemTemp.supplier1Id = this.data.abstractOfCanvass.supplier[0].supplierId;
              _itemTemp.supplier1Name = this.data.abstractOfCanvass.supplier[0].supplierName;
              _itemTemp.supplier1Qty = _supp1Item.quantity;
              _itemTemp.supplier1Price = _supp1Item.priceRead;
              _itemTemp.supplier1Selected = _supp1Item.awarded;
            }
  
            if (this.data.abstractOfCanvass.supplier[1]) {
              var _supp2Item: AbstractOfCanvassItemModel = this.data.abstractOfCanvass.supplier[1].items.find(_suppItem => _suppItem.itemId == _item.itemId);
              _itemTemp.supplier2Id = this.data.abstractOfCanvass.supplier[1].supplierId;
              _itemTemp.supplier2Name = this.data.abstractOfCanvass.supplier[1].supplierName;
              _itemTemp.supplier2Qty = _supp2Item.quantity;
              _itemTemp.supplier2Price = _supp2Item.priceRead;
              _itemTemp.supplier2Selected = _supp2Item.awarded;
            }
  
            if (this.data.abstractOfCanvass.supplier[2]) {
              var _supp3Item: AbstractOfCanvassItemModel = this.data.abstractOfCanvass.supplier[2].items.find(_suppItem => _suppItem.itemId == _item.itemId);
              _itemTemp.supplier3Id = this.data.abstractOfCanvass.supplier[2].supplierId;
              _itemTemp.supplier3Name = this.data.abstractOfCanvass.supplier[2].supplierName;
              _itemTemp.supplier3Qty = _supp3Item.quantity;
              _itemTemp.supplier3Price = _supp3Item.priceRead;
              _itemTemp.supplier3Selected = _supp3Item.awarded;
            }
  
            this.dataSource.data.push(_itemTemp);
            this.refreshTable();
          }
        });

        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  itemSelectionAll(_supp: number) {
    this.dataSource.data.forEach(_item => {
      switch(_supp) {
        case 1:
          _item.supplier1Selected = this.selectAllSupp1;
          break;
        case 2:
          _item.supplier2Selected = this.selectAllSupp2;
          break;
        case 3:
          _item.supplier3Selected = this.selectAllSupp3;
          break;
      }
    });
  }

  itemSelectionChanged(_supp: number) {
    switch(_supp) {
      case 1:
        this.selectAllSupp1 = this.dataSource.data.filter(_item => _item.supplier1Selected == true).length == this.dataSource.data.length;
        break;
      case 2:
        this.selectAllSupp2 = this.dataSource.data.filter(_item => _item.supplier2Selected == true).length == this.dataSource.data.length;
        break;
      case 3:
        this.selectAllSupp3 = this.dataSource.data.filter(_item => _item.supplier3Selected == true).length == this.dataSource.data.length;
        break;
    }
  }

  saveChanges() {
    if (this.data.action == "Approve") {
      if (this.approveSupp1) {
        this.data.abstractOfCanvass.supplier[0].items.forEach(item => {
          if (item.awarded) {
            item.approved = true;
          }
        })
      }
      if (this.approveSupp2) {
        this.data.abstractOfCanvass.supplier[1].items.forEach(item => {
          if (item.awarded) {
            item.approved = true;
          }
        })
      }
      if (this.approveSupp3) {
        this.data.abstractOfCanvass.supplier[2].items.forEach(item => {
          if (item.awarded) {
            item.approved = true;
          }
        })
      }
    }

    if (this.data.action == "Award") {
      this.dataSource.data.forEach(_item => {

        if (this.data.abstractOfCanvass.supplier[0] && _item.supplier1Selected) {
          var _supp1Item: AbstractOfCanvassItemModel = this.data.abstractOfCanvass.supplier[0].items.find(_suppItem => _suppItem.itemId == _item.itemId);
          _supp1Item.quantity = _item.supplier1Qty;
          _supp1Item.priceRead = _item.supplier1Price;
          _supp1Item.awarded = _item.supplier1Selected;
        }

        if (this.data.abstractOfCanvass.supplier[1] && _item.supplier2Selected) {
          var _supp2Item: AbstractOfCanvassItemModel = this.data.abstractOfCanvass.supplier[1].items.find(_suppItem => _suppItem.itemId == _item.itemId);
          _supp2Item.quantity = _item.supplier2Qty;
          _supp2Item.priceRead = _item.supplier2Price;
          _supp2Item.awarded = _item.supplier2Selected;
        }

        if (this.data.abstractOfCanvass.supplier[2] && _item.supplier3Selected) {
          var _supp3Item: AbstractOfCanvassItemModel = this.data.abstractOfCanvass.supplier[2].items.find(_suppItem => _suppItem.itemId == _item.itemId);
          _supp3Item.quantity = _item.supplier3Qty;
          _supp3Item.priceRead = _item.supplier3Price;
          _supp3Item.awarded = _item.supplier3Selected;
        }

      })
    }

    this.dialogRef.close(
      {
        abstractOfCanvass: this.data.abstractOfCanvass
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  refreshTable() {
    let cloned = this.dataSource.data.slice();
    this.dataSource.data = cloned;
  }

}
