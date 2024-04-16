import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/data-model/item';
import { PreRepairInspectionItemsModel } from 'src/app/data-model/pre-repair-inspection-items-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { ListItemPpDialogComponent } from '../../project-proposal/list-item-pp-dialog/list-item-pp-dialog.component';

export interface DialogData {
  selectedItem: PreRepairInspectionItemsModel;
}

@Component({
  selector: 'app-pre-repair-item-details-dialog',
  templateUrl: './pre-repair-item-details-dialog.component.html',
  styleUrls: ['./pre-repair-item-details-dialog.component.css']
})
export class PreRepairItemDetailsDialogComponent implements OnInit {
  itemFormGroup: FormGroup;
  itemSelection: Item[] = [];
  itemSelected: { value: string; text: string } = {value: "", text: ""};
  itemPrice: number = 0.00;
  itemQty: number = 1;
  itemTotal: number = 0.00;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<PreRepairItemDetailsDialogComponent>,
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
      this.itemFormGroup.controls['description'].setValue(this.data.selectedItem.description);
      this.itemFormGroup.controls['quantity'].setValue(this.data.selectedItem.quantity);
      this.itemQty = this.data.selectedItem.quantity;
      this.itemFormGroup.controls['unitMeasure'].setValue(this.data.selectedItem.uom);
      this.itemFormGroup.controls['unitCost'].setValue(this.data.selectedItem.cost);
      this.itemPrice = this.data.selectedItem.cost;
      this.itemFormGroup.controls['totalCost'].setValue(this.data.selectedItem.total);
      this.itemFormGroup.controls['remarks'].setValue(this.data.selectedItem.remarks);
      this.itemFormGroup.controls['dateAcquired'].setValue(this.data.selectedItem.dateAcquired);
      this.itemSelected = {
        value: this.data.selectedItem.itemId,
        text: this.data.selectedItem.description
      };

      this.httpRequest.getItemById(this.data.selectedItem.itemId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.itemFormGroup.controls['type'].setValue(result.data.typedesc);
        }
      });
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
      remarks: new FormControl("", [Validators.required]),
      dateAcquired: new FormControl(new Date, [Validators.required]),
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

  showListItem(itemType: string) {
    const dialogRef = this.dialog.open(ListItemPpDialogComponent, {
      data: {
        itemCategory: itemType
      },
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          this.itemFormGroup.controls['unitMeasure'].setValue(result.selectedItem.uom);
          this.itemFormGroup.controls['type'].setValue(result.selectedItem.typedesc);
          this.itemPrice = result.selectedItem.itemPrice;
          this.computeTotalFromAmt(this.itemPrice);
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

  addItem() {
    this.dialogRef.close(
      {
        itemId: this.itemSelected.value,
        type: this.itemFormGroup.get("type")?.value,
        description: this.itemSelected.text,
        quantity: this.itemQty,
        uom: this.itemFormGroup.get("unitMeasure")?.value,
        cost: this.itemPrice,
        total: this.itemFormGroup.get("totalCost")?.value,
        remarks: this.itemFormGroup.get("remarks")?.value,
        dateAcquired: this.itemFormGroup.get("dateAcquired")?.value,
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
