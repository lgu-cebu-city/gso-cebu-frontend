import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/data-model/item';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';
import { UnitConversion } from 'src/app/data-model/unit-conversion';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { UnitSelectionDialogComponent } from '../../transfer-withdrawal/unit-selection-dialog/unit-selection-dialog.component';
import { ListItemRisDialogComponent } from '../list-item-ris-dialog/list-item-ris-dialog.component';
import { DialogData, RequisitionSlipComponent } from '../requisition-slip.component';

@Component({
  selector: 'app-ris-item-details-dialog',
  templateUrl: './ris-item-details-dialog.component.html',
  styleUrls: ['./ris-item-details-dialog.component.css']
})
export class RisItemDetailsDialogComponent implements OnInit {
  itemFormGroup: FormGroup;
  itemSelected: { value: string; text: string } = {value: "", text: ""};
  itemCodeSelected: string;
  unitId: string = "";
  selectedItem: Item;
  selectedUnit: UnitConversion;
  qtyMultiplier: number;
  reqQty: number = 1;
  issQty: number;
  genericItemId: string;
  selectedItemQty: number = 0;
  btnText: string = "Add";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<RequisitionSlipComponent>,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initItemForm();
  }

  initItemForm() {
    if (this.data != undefined && this.data.selectedItem != undefined) {
      this.qtyMultiplier = this.data.selectedItem.issuedQty / this.data.selectedItem.requestedQty;
      this.itemCodeSelected = this.data.selectedItem.itemCode;
      this.itemSelected = {
        value: this.data.selectedItem.itemId,
        text: this.data.selectedItem.description
      };
      this.itemFormGroup = new FormGroup({
        description: new FormControl(this.data.selectedItem.description, [Validators.required]),
        unitMeasure: new FormControl(this.data.selectedItem.uom, [Validators.required]),
        quantity: new FormControl(this.data.selectedItem.requestedQty, [Validators.required]),
        issuedUnit: new FormControl(this.data.selectedItem.issuedUnit, [Validators.required]),
        issuedQty: new FormControl(this.data.selectedItem.issuedQty, [Validators.required]),
        remarks: new FormControl(this.data.selectedItem.remarks, [Validators.required])
      });
      this.reqQty = this.data.selectedItem.requestedQty;
      this.issQty = this.data.selectedItem.issuedQty;

      this.httpRequest.getInventoryReportById(this.data.selectedItem.itemId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.selectedItemQty = result.data.onhandQty;
        }
      });

      this.httpRequest.getItemById(this.data.selectedItem.itemId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.selectedItem = result.data;
        }
      });

      this.btnText = "Update";

    } else {
      this.itemFormGroup = new FormGroup({
        description: new FormControl("", [Validators.required]),
        unitMeasure: new FormControl("", [Validators.required]),
        quantity: new FormControl("1", [Validators.required]),
        issuedUnit: new FormControl("", [Validators.required]),
        issuedQty: new FormControl("1", [Validators.required]),
        remarks: new FormControl("", [Validators.required])
      });
    }
  }

  showListItem(itemType: string) {
    const dialogRef = this.dialog.open(ListItemRisDialogComponent, {
      data: {
        itemCategory: itemType
      },
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          this.selectedItem = result.selectedItem;
          this.itemFormGroup.controls['unitMeasure'].setValue(result.selectedItem.uom);
          this.itemCodeSelected = result.selectedItem.code;
          this.itemSelected = {
            value: result.selectedItem.id,
            text: result.selectedItem.description
          };
          this.selectedItemQty = result.selectedItem.quantity;
          this.genericItemId = result.selectedItem.genericId;

          if (this.data.transType == "Transfer Withdrawal") {
            if (result.selectedItem.unitId != "") {
              this.httpRequest.getUnitConversionById(result.selectedItem.unitId).subscribe((result) => {
                if (result.statusCode == 200) {
                  this.setUnit(result.data);
                }
              });
            }
          }
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item selected.");
        }
      }
    });
  }

  setUnit(unit: UnitConversion) {
    this.selectedUnit = unit;
    this.itemFormGroup.controls['issuedUnit'].setValue(unit.unit4);
    var qty = this.itemFormGroup.get("quantity")?.value;
    this.qtyMultiplier = unit.quantity4 * unit.quantity3 * unit.quantity2 * unit.quantity1;
    this.itemFormGroup.controls['issuedQty'].setValue(this.qtyMultiplier * qty);
    this.unitId = unit.id
  }

  showListUnit() {
    const dialogRef = this.dialog.open(UnitSelectionDialogComponent, {
      data: {
        itemType: this.selectedItem.typeId
      },
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedUnit) {
          this.setUnit(result.selectedUnit);
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item Unit.");
        }
      }
    });
  }

  addItem() {
    if (this.itemFormGroup.get("quantity")?.value <= 0 || this.itemFormGroup.get("issuedQty")?.value <= 0) {
      this.notifService.showNotification(NotificationType.error, "Quantity must be greater than zero.");
      return;
    // } else if (this.itemFormGroup.get("quantity")?.value < this.itemFormGroup.get("issuedQty")?.value) {
    //   this.notifService.showNotification(NotificationType.error, "Issued Quantity must be lesser or equal to Requested Quantity.");
    //   return;
    }
    if (this.itemFormGroup.get("quantity")?.value > this.selectedItemQty) {
      this.notifService.showNotification(NotificationType.error, "Insufficient item quantity.");
      return;
    }
    var retItem = new RequisitionAndIssuanceItemModel(
      "",
      this.itemSelected.value,
      this.itemCodeSelected,
      this.unitId,
      this.itemFormGroup.get("unitMeasure")?.value,
      this.itemSelected.text,
      this.reqQty,
      this.data.transType == "Transfer Withdrawal" ? this.itemFormGroup.get("issuedUnit")?.value : this.itemFormGroup.get("unitMeasure")?.value,
      this.issQty,
      "",
      this.genericItemId,
      this.selectedItem.typeId,
      this.selectedItem.price,
      this.itemFormGroup.get("remarks")?.value
    );

    this.dialogRef.close(
      {
        retItem
      }
    );
  }

  onQtyChange(val: any) {
    if (val) {
      this.issQty = val * (this.qtyMultiplier || 1);
    }
  }

  onIssueQtyChange(val: any) {
    if (val) {
      this.reqQty = val / (this.qtyMultiplier || 1);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
