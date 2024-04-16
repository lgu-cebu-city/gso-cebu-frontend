import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { AcknowledgementReceiptItemsModel } from 'src/app/data-model/acknowledgment-receipt-items-model';
import { AcknowledgementReceiptSubItemsModel } from 'src/app/data-model/acknowledgment-receipt-sub-items-model';
import { Item } from 'src/app/data-model/item';
import { Type } from 'src/app/data-model/type';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { ItemSetupDialogComponent } from '../../acceptance-and-inspection-report/item-setup-dialog/item-setup-dialog.component';
import { ListItemDialogComponent } from '../../acceptance-and-inspection-report/list-item-dialog/list-item-dialog.component';
import { AcknowledgmentReceiptOfEquipmentComponent, DialogData } from '../acknowledgment-receipt-of-equipment.component';

@Component({
  selector: 'app-are-add-item-dialog',
  templateUrl: './are-add-item-dialog.component.html',
  styleUrls: ['./are-add-item-dialog.component.css']
})
export class AreAddItemDialogComponent implements OnInit {
  displayedColumns: string[] = ['uom', 'quantity', 'description', 'serialNo', 'model', 'action'];
  subItemDataSource: AcknowledgementReceiptSubItemsModel[] = [];
  genericItemSelection: Item[] = [];
  nonGenericItemSelection: Item[] = [];
  itemSelectionState: { genericSelected: boolean; nonGenericSelected: boolean } = {genericSelected: false, nonGenericSelected: false};
  itemSelectedGeneric: { value: string; text: string } = {value: "", text: ""};
  itemSelectedNonGeneric: { value: string; text: string } = {value: "", text: ""};
  selectedSubItem: AcknowledgementReceiptSubItemsModel;
  typeList: Type[];
  itemType: string = "";
  itemTypeName: string = "";
  withSubItem: boolean = false;
  buttonText: string = "Add";

  id: string = "";
  poItemId: string = "";
  unitMeasure: string = "";
  quantity: number = 1;
  price: number = 0;
  recQty: number = 1;
  expirationDate: Date = null;
  lotNo: string  = "";
  remarks: string = "";
  serialNo: string = "";
  model: string = "";
  propertyNo: string = "";
  dateAcquired: Date = new Date;

  // SubItem
  sIndex: number;
  sButton: string = "add";
  sId: string = "";
  subItemSelectedNonGeneric: { value: string; text: string } = {value: "", text: ""};
  sUnitMeasure: string = "";
  sQuantity: number = 1;
  sSerialNo: string = "";
  sModel: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<AcknowledgmentReceiptOfEquipmentComponent>,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.loadGroupType();

    if (this.data != undefined) {
      var selectedItem = this.data.selectedItem;
      this.id = selectedItem.id;
      this.propertyNo = selectedItem.propertyNo;
      this.poItemId = selectedItem.poItemId;
      this.quantity = selectedItem.quantity;
      this.unitMeasure = selectedItem.uom;
      this.price = selectedItem.price;
      this.recQty = selectedItem.receivedQuantity;
      this.expirationDate = selectedItem.expirationDate;
      this.lotNo = selectedItem.lotNo;
      this.remarks = selectedItem.remarks;
      this.serialNo = selectedItem.serialNo;
      this.model = selectedItem.model;
      this.buttonText = "Update";

      this.itemSelectedGeneric = {
        value: selectedItem.itemId,
        text: selectedItem.description
      };
      this.itemSelectedNonGeneric = {
        value: selectedItem.brandId,
        text: selectedItem.brand
      };

      if (selectedItem.subItems.length) {
        this.withSubItem = true;
        this.subItemDataSource = selectedItem.subItems;
        this.refreshTable();
      }

      this.httpRequest.getItemById(selectedItem.itemId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.itemType = result.data.typeId;
          this.itemTypeName = result.data.typedesc;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.displaySubItem();
  }

  loadGroupType() {
    this.httpRequest.getItemTypeByGroup("Equipment").subscribe((result) => {
      if (result.statusCode == 200) {
        this.typeList = result.data;
      }
    });
  }

  typeSelectionChanged(event: MatSelectChange) {
    this.itemTypeName = event.source.triggerValue;
    this.itemSelectedGeneric = {value: "", text: ""};
    this.itemSelectedNonGeneric = {value: "", text: ""};
    this.unitMeasure = "";
  }
  
  showListItem(itemCategory: string) {
    if (!this.itemType) {
      this.notifService.showNotification(NotificationType.error, "Please select item group.");
      return;
    }
    
    this.openListItemDialog(itemCategory);
  }

  openListItemDialog(itemCategory: string) {
    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      data: {
        itemCategory: itemCategory,
        itemType: this.itemType
      },
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          this.setItem(result.selectedItem, itemCategory);
        } else if (result.isAddItem) {
          this.openItemSetupDialog(itemCategory);
        }
      }
    });
  }

  openItemSetupDialog(itemCategory: string) {
    const dialogRef = this.dialog.open(ItemSetupDialogComponent, {
      data: {
        itemCategory: itemCategory,
        itemType: this.itemType
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          this.setItem(result.selectedItem, itemCategory);
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item selected.");
        }
      }
    });
  }

  setItem(selectedItem: Item, itemCategory: string) {
    if (selectedItem) {
      if (itemCategory == "Generic") {
        this.unitMeasure = selectedItem.uom;
        this.itemSelectedGeneric = {
          value: selectedItem.id,
          text: selectedItem.description
        };

        this.itemSelectionState.genericSelected = true;

        if (!this.itemSelectionState.nonGenericSelected) {
          this.httpRequest.getItemRelation(itemCategory, selectedItem.id).subscribe((result) => {
            if (result.statusCode == 200 && result.data) {
              this.itemSelectedNonGeneric = {
                value: result.data.nonGenericId,
                text: result.data.nonGenericDescription
              };
            } else {
              this.itemSelectedNonGeneric = {
                value: "",
                text: ""
              };
            }
          });
        }
      } else if (itemCategory == "Non-Generic") {
        this.itemSelectedNonGeneric = {
          value: selectedItem.id,
          text: selectedItem.description
        };

        this.itemSelectionState.nonGenericSelected = true;

        if (!this.itemSelectionState.genericSelected) {
          this.httpRequest.getItemRelation(itemCategory, selectedItem.id).subscribe((result) => {
            if (result.statusCode == 200 && result.data) {
              this.unitMeasure = result.data.genericUom;
              this.itemSelectedGeneric = {
                value: result.data.genericId,
                text: result.data.genericDescription
              };
            } else {
              this.unitMeasure = "";
              this.itemSelectedGeneric = {
                value: "",
                text: ""
              };
            }
          });
        }
      }
    } else {
      this.notifService.showNotification(NotificationType.error, "No Item selected.");
    }
  }

  quantityChanged(qty: number) {
    this.recQty = qty;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.itemSelectedGeneric.value == "") {
      msg = "Please select item.";
    }
    if (this.itemSelectedNonGeneric.value = "") {
      msg = "Please select item.";
    }
    if (this.unitMeasure == "") {
      msg = "Please select Unit of Measurement.";
    }
    if (this.quantity <= 0 || this.recQty <= 0) {
      msg = "Please input quantity.";
    }
    if (this.price <= 0) {
      msg = "Please input price.";
    }

    return {result: msg == "", message: msg};
  }

  addItem() {
    if (!this.isEntryValid().result) {
      this.notifService.showNotification(NotificationType.error, this.isEntryValid().message);
      return;
    }

    var item = new AcknowledgementReceiptItemsModel(
      this.id,
      this.poItemId,
      this.itemType,
      this.itemTypeName,
      this.itemSelectedGeneric.value,
      this.propertyNo,
      this.itemSelectedGeneric.text,
      this.unitMeasure,
      this.quantity,
      this.price,
      this.dateAcquired,
      this.recQty,
      this.itemSelectedNonGeneric.text,
      this.itemSelectedNonGeneric.value,
      null,
      "",
      this.remarks,
      this.serialNo,
      this.model,
      "",
      "",
      this.withSubItem ? this.subItemDataSource : []
    );
    
    this.dialogRef.close(
      {
        item: item
      }
    );
  }

  subItemCheckedChanged(event: MatCheckboxChange) {
    this.withSubItem = event.checked;
    this.displaySubItem();
  }

  displaySubItem() {
    const subItemPanel = <HTMLElement>document.getElementsByClassName('sub-item-panel')[0];
    const dialogContainer = <HTMLElement>document.getElementsByClassName('dialog-panel')[0];
    const dialogMainPanel = <HTMLElement>document.getElementsByClassName('dialog-main-panel')[0];
    if (this.withSubItem) {
      subItemPanel.style.display = "block";
      subItemPanel.style.maxWidth = "63%";
      dialogContainer.style.width = "80vw";
      dialogMainPanel.style.display = "flex";
      dialogMainPanel.style.maxWidth = "35%";
    } else {
      subItemPanel.style.display = "none";
      subItemPanel.style.maxWidth = "";
      dialogContainer.style.width = "30vw";
      dialogMainPanel.style.display = "";
      dialogMainPanel.style.maxWidth = "";
    }
  }
  
  showListSubItem(itemCategory: string) {
    if (!this.itemType) {
      this.notifService.showNotification(NotificationType.error, "Please select item group.");
      return;
    }
    
    this.openListSubItemDialog(itemCategory);
  }

  openListSubItemDialog(itemCategory: string) {
    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      data: {
        itemCategory: itemCategory,
        itemType: this.itemType
      },
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          this.setSubItem(result.selectedItem);
        } else if (result.isAddItem) {
          this.openSubItemSetupDialog(itemCategory);
        }
      }
    });
  }

  openSubItemSetupDialog(itemCategory: string) {
    const dialogRef = this.dialog.open(ItemSetupDialogComponent, {
      data: {
        itemCategory: itemCategory,
        itemType: this.itemType
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          this.setSubItem(result.selectedItem);
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item selected.");
        }
      }
    });
  }

  setSubItem(selectedItem: Item) {
    if (selectedItem) {
      this.sUnitMeasure = selectedItem.uom;
      this.subItemSelectedNonGeneric = {
        value: selectedItem.id,
        text: selectedItem.description
      };
    } else {
      this.notifService.showNotification(NotificationType.error, "No Item selected.");
    }
  }

  isSubItemEntryValid(): boolean {
    var retVal = true;
    
    if (this.subItemSelectedNonGeneric.value == "") {
      retVal = false;
    }
    if (this.sQuantity <= 0) {
      retVal = false;
    }

    return retVal;
  }

  addSubItem() {
    if (!this.isSubItemEntryValid()) {
      this.notifService.showNotification(NotificationType.error, "Please input required fields!");
      return;
    }

    var item = new AcknowledgementReceiptSubItemsModel(
      this.sId,
      this.subItemSelectedNonGeneric.value,
      this.subItemSelectedNonGeneric.text,
      this.sUnitMeasure,
      this.sQuantity,
      this.sSerialNo,
      this.sModel
    );
    if (this.sButton == "add") {
      this.subItemDataSource.push(item);
    } else if (this.sButton == "update") {
      this.subItemDataSource[this.sIndex] = item;
    }
    
    this.refreshTable();
    this.clearSubItemEntry();
  }

  clearSubItemEntry() {
    this.sId = "";
    this.subItemSelectedNonGeneric = { value: "", text: "" };
    this.sUnitMeasure = "";
    this.sQuantity = 1;
    this.sSerialNo = "";
    this.sModel = "";
    this.sIndex = null;
    this.sButton = "add";
  }

  refreshTable() {
    let cloned = this.subItemDataSource.slice();
    this.subItemDataSource = cloned;
  }

  editSubItem(i: number) {
    this.sIndex = i;
    var item = this.subItemDataSource[i];
    this.sId = item.id;
    this.subItemSelectedNonGeneric = { value: item.itemId, text: item.description };
    this.sUnitMeasure = item.uom;
    this.sQuantity = item.quantity;
    this.sSerialNo = item.serialNo;
    this.sModel = item.model;
    this.sButton = "update"
  }

  deleteSubItem(i: number) {
    this.subItemDataSource.splice(i, 1);
    this.refreshTable();
  }

  rowSelected(row: AcknowledgementReceiptSubItemsModel) {
    this.selectedSubItem = row;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
