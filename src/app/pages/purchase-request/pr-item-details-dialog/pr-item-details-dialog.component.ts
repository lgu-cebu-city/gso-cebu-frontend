import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Accounts } from 'src/app/data-model/Accounts';
import { Item } from 'src/app/data-model/item';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { PrListItemDialogComponent } from '../pr-list-item-dialog/pr-list-item-dialog.component';
import { DialogData } from '../purchase-request.component';

@Component({
  selector: 'app-pr-item-details-dialog',
  templateUrl: './pr-item-details-dialog.component.html',
  styleUrls: ['./pr-item-details-dialog.component.css']
})
export class PrItemDetailsDialogComponent implements OnInit {
  itemFormGroup: FormGroup;
  itemSelection: Item[] = [];
  itemSelected: { value: string; text: string } = {value: "", text: ""};
  accountSelected: { value: number; text: string } = {value: 0, text: ""};
  itemPrice: number = 0.00;
  itemQty: number = 1;
  itemTotal: number = 0.00;
  itemTypeId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PrItemDetailsDialogComponent>,
    private httpRequest: HttpRequestService,
    public dialog: MatDialog,
    private notifService : NotificationService,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.loadItems();
    this.initItemForm();

    if (this.data != undefined) {
      if (this.data.selectedItem) {
        this.itemFormGroup.controls['description'].setValue(this.data.selectedItem.description);
        this.itemFormGroup.controls['quantity'].setValue(this.data.selectedItem.quantity);
        this.itemQty = this.data.selectedItem.quantity;
        this.itemFormGroup.controls['unitMeasure'].setValue(this.data.selectedItem.uom);
        this.itemFormGroup.controls['unitCost'].setValue(this.data.selectedItem.cost);
        this.itemPrice = this.data.selectedItem.cost;
        this.itemFormGroup.controls['totalCost'].setValue(this.data.selectedItem.total);
        this.itemFormGroup.controls['remarks'].setValue(this.data.selectedItem.remarks);
        this.itemSelected = {
          value: this.data.selectedItem.itemId,
          text: this.data.selectedItem.description
        };
  
        this.httpRequest.getItemById(this.data.selectedItem.itemId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.itemFormGroup.controls['type'].setValue(result.data.typedesc);
          }
        });
        this.itemTypeId = this.data.selectedItem.typeId;

        if (this.data.selectedItem.accId) {
          var _currAcc: Accounts = this.data.selectedFund.find(_acc => _acc.id == this.data.selectedItem.accId);
          this.accountSelected.value = _currAcc.id;
          this.accountSelected.text = _currAcc.description;
        }
      }
    }
  }

  initItemForm() {
    this.itemFormGroup = new FormGroup({
      description: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      unitMeasure: new FormControl("", [Validators.required]),
      unitCost: new FormControl("0.00", [Validators.required]),
      quantity: new FormControl("1", [Validators.required]),
      totalCost: new FormControl("0.00", [Validators.required]),
      remarks: new FormControl("", [Validators.required])
    });
  }

  loadItems() {
    this.httpRequest.getListItemByCategory("Generic").subscribe((result) => {
      if (result.statusCode == 200) {
        this.itemSelection = result.data;
      }
    });
  }

  selectItem(item: Item) {
    this.itemFormGroup.controls['type'].setValue(item.typedesc);
    this.itemFormGroup.controls['unitMeasure'].setValue(item.uom);
    this.itemSelected = {
      value: item.id,
      text: item.description
    };
  }

  showListItem(itemCategory: string) {
    const dialogRef = this.dialog.open(PrListItemDialogComponent, {
      data: {
        itemCategory: itemCategory,
        selectedTypeId: this.itemTypeId
      },
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          this.itemFormGroup.controls['unitMeasure'].setValue(result.selectedItem.uom);
          this.itemFormGroup.controls['type'].setValue(result.selectedItem.typedesc);
          this.itemTypeId = result.selectedItem.typeId;
          this.computeTotalFromAmt(result.selectedItem.price);
          this.itemSelected = {
            value: result.selectedItem.id,
            text: result.selectedItem.description
          };
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item selected.");
        }
      }
    });
  }

  computeTotalFromQty(x: any) {
    this.itemQty = x;
    var price = this.itemPrice;
    var qty = this.itemQty;
    var total: number = price * qty;
    this.itemTotal = total;
  }

  computeTotalFromAmt(x: any) {
    this.itemPrice = x;
    var price = this.itemPrice;
    var qty = this.itemQty;
    var total: number = price * qty;
    this.itemTotal = total;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.itemSelected.value == "") {
      msg = "Please select Item.";
    }
    if (this.itemPrice == 0) {
      msg = "Item price must be greater than zero.";
    }
    if (this.itemQty == 0) {
      msg = "Item quantity must be greater than zero."
    }
    if (this.accountSelected.value == 0) {
      msg = "Please select Account."
    }

    return {result: msg == "", message: msg};
  }

  addItem() {
    var isDataValid = this.isEntryValid();
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }

    this.dialogRef.close(
      {
        id: this.data?.selectedItem?.id || "",
        itemId: this.itemSelected.value,
        description: this.itemSelected.text,
        specification: this.data?.selectedItem?.specification || "",
        typeId: this.itemTypeId,
        quantity: this.itemQty,
        dbmQty: this.data?.selectedItem?.dbmQty || 0,
        callOutQty: this.data?.selectedItem?.callOutQty || 0,
        uom: this.itemFormGroup.get("unitMeasure")?.value,
        cost: this.itemPrice,
        total: this.itemFormGroup.get("totalCost")?.value,
        remarks: this.itemFormGroup.get("remarks")?.value,
        consPrId: this.data?.selectedItem?.consPrId || "",
        appId: this.data?.selectedItem?.appId || 0,
        accId: this.accountSelected.value,
        
      }
    );
  }
  
  accountSelectedValue(event: MatSelectChange) {
    this.accountSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
