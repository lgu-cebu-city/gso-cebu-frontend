import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { map, Observable, startWith } from 'rxjs';
import { AcceptanceAndInspectionReportItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-items-model';
import { AcceptanceAndInspectionReportSubItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-sub-items-model';
import { Group } from 'src/app/data-model/group';
import { Item } from 'src/app/data-model/item';
import { Type } from 'src/app/data-model/type';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { AcceptanceAndInspectionReportComponent, DialogData } from '../acceptance-and-inspection-report.component';
import { ItemSetupDialogComponent } from '../item-setup-dialog/item-setup-dialog.component';
import { ListItemDialogComponent } from '../list-item-dialog/list-item-dialog.component';
import { AcceptanceAndInspectionReportDetailedItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-detailed-items-model';

interface ItemDtlInfo{
  propCode: string,
  brand: string,
  model: string,
  serial: string,
  subItems: AcceptanceAndInspectionReportSubItemsModel[]
}

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {
  formControl = new FormControl('');
  displayedColumns: string[] = ['quantity', 'description', 'serialNo', 'model', 'action'];
  subItemDataSource: AcceptanceAndInspectionReportSubItemsModel[] = [];
  genericItemSelection: Item[] = [];
  nonGenericItemSelection: Item[] = [];
  itemSelectionState: { genericSelected: boolean; nonGenericSelected: boolean } = {genericSelected: false, nonGenericSelected: false};
  itemSelectedGeneric: { value: string; text: string } = {value: "", text: ""};
  itemSelectedNonGeneric: { value: string; text: string } = {value: "", text: ""};
  selectedSubItem: AcceptanceAndInspectionReportSubItemsModel;
  groupType: Group[];
  listType: Type[] = [];
  selectedItemType: string;
  filteredGroupType: Observable<Group[]>;
  filteredType: Type[];
  itemType: string = "";
  itemTypeName: string = "";
  withSubItem: boolean = false;
  withExpiry: boolean = false;
  buttonText: string = "Add";

  currentIndex = 0;
  uCode = "";
  listItems: ItemDtlInfo[] = [];
  isEquipment: boolean = false;

  id: string = "";
  poItemId: string = "";
  specification: string = "";
  unitMeasure: string = "";
  quantity: number = 1;
  price: number = 0;
  recQty: number = 1;
  balance: number = 0;
  expirationDate: Date = null;
  lotNo: string  = "";
  remarks: string = "";
  serialNo: string = "";
  model: string = "";

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
    private dialogRef: MatDialogRef<AcceptanceAndInspectionReportComponent>,
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
    public dialog: MatDialog,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.loadGroupType().then(value => {
      this.generatePropCode();

      if (this.data != undefined) {
        var selectedItem = this.data.selectedItem;

        this.httpRequest.getItemById(selectedItem.itemId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.itemType = result.data.typeId;
            this.itemTypeName = result.data.typedesc;
          }
        });

        this.isEquipment = this.groupType.find(_group => _group.description == "Equipment").type.find(_type => _type.id == selectedItem.groupId) != undefined;
        
        this.id = selectedItem.id;
        this.poItemId = selectedItem.poItemId;
        this.specification = selectedItem.specification;
        this.quantity = selectedItem.quantity;
        this.unitMeasure = selectedItem.uom;
        this.price = selectedItem.price;
        this.recQty = selectedItem.receivedQuantity;
        this.balance = selectedItem.balance;
        this.expirationDate = selectedItem.expirationDate;
        this.withExpiry = this.expirationDate != null || this.listType.find(t => t.id == selectedItem.groupId).isMedicine == "1";
        this.lotNo = selectedItem.lotNo;
        this.remarks = selectedItem.remarks;
        this.buttonText = "Update";

        this.itemSelectedGeneric = {
          value: selectedItem.itemId,
          text: selectedItem.description
        };
        // this.itemSelectedNonGeneric = {
        //   value: selectedItem.brandId,
        //   text: selectedItem.brand
        // };
        // this.model = selectedItem.model;
        // this.serialNo = selectedItem.serialNo;

        // if (selectedItem.subItems.length) {
        //   this.withSubItem = true;
        //   this.subItemDataSource = selectedItem.subItems;
        //   this.refreshTable();
        // }

        if (this.isEquipment) {
          if (selectedItem.detailedItem.length > 0) {
            selectedItem.detailedItem.forEach((_itm) => {
              this.listItems.push({
                propCode: _itm.propCode,
                brand: _itm.brand,
                model: _itm.model,
                serial: _itm.serial,
                subItems: _itm.subItems,
              });
            });
            this.displayDetailedItem();
          } else {
            this.generatePropCode().then((_xPropCode) => {
              for(var i = 0; i < this.quantity; i ++) {
                this.listItems.push({
                  propCode: (_xPropCode + "-" + ("00" + i).slice(-2)),
                  brand: "",
                  model: "",
                  serial: "",
                  subItems: []
                });
              }
              this.displayDetailedItem();
            });
          }
        }
      }
    });
  }

  displayDetailedItem() {
    var _xItem: ItemDtlInfo = this.listItems[this.currentIndex];
    this.uCode = _xItem.propCode;
    this.itemSelectedNonGeneric.text = _xItem.brand;
    this.model = _xItem.model;
    this.serialNo = _xItem.serial;
    this.subItemDataSource = _xItem.subItems;
  
    if (this.subItemDataSource.length > 0) {
      this.withSubItem = true;
    } else {
      this.withSubItem = false;
    }
    this.displaySubItem();
  }

  async generatePropCode(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getAcceptanceAndInspectionReportTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          return res(result.data[0].transactionNo.substring(9));
        } else {
          return rej("");
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.displaySubItem();
  }

  filterGroup(val: string): Group[] {
    if (val) {
      return this.groupType
        .map(group => ({ id: group.id, description: group.description, type: this._filter(group.type, val) }))
        .filter(group => group.type.length > 0);
    }

    return this.groupType;
  }

  private _filter(opt: Type[], val: string): Type[] {
    const filterValue = val.toLowerCase();
    this.filteredType = opt.filter(item => item.description.toLowerCase().startsWith(filterValue));

    if (this.filteredType.length == 1) {
      this.itemType = this.filteredType[0].id;
    }

    return this.filteredType;
  }

  loadGroupType(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getItemGroupWithType().subscribe((result) => {
        if (result.statusCode == 200) {
          this.groupType = result.data;
          this.groupType.forEach(g => {
            this.listType.push(... g.type);
          });
  
          this.filteredGroupType = this.formControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filterGroup(value || '')),
          );
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }

  selectionChanged(event: any) {
    this.itemSelectedGeneric = {value: "", text: ""};
    this.itemSelectedNonGeneric = {value: "", text: ""};
    this.unitMeasure = "";

    if (this.listType.find(t => t.id == this.itemType)?.isMedicine == "1") {
      this.withExpiry = true;
    } else {
      this.withExpiry = false;
    }
  }

  typeSelectionChanged(event: MatSelectChange) {
    this.itemTypeName = event.source.triggerValue;
    this.itemSelectedGeneric = {value: "", text: ""};
    this.itemSelectedNonGeneric = {value: "", text: ""};
    this.unitMeasure = "";

    if (this.listType.find(t => t.id == this.itemType)?.isMedicine == "1") {
      this.withExpiry = true;
    } else {
      this.withExpiry = false;
    }
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

  recQuantityChanged(qty: number) {
    if (qty > this.quantity) {
      this.notifService.showNotification(NotificationType.error, "Received Quantity must not be higher than the PO Quantity.");
      this.recQty = this.quantity;
    }
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.itemSelectedGeneric.value == "") {
      msg = "Please select Generic Item.";
    }
    if (this.unitMeasure == "") {
      msg = "Please input Unit of Measurement.";
    }
    if (this.quantity <= 0 || this.recQty <= 0) {
      msg = "Quantity must be greater than 0.";
    }
    if (this.price <= 0) {
      msg = "Please input Price.";
    }
    if (this.withExpiry) {
      if (this.expirationDate == null) {
        msg = "Please input Expiration Date.";
      }
      if (this.lotNo == "") {
        msg = "Please input Batch No.";
      }
    }

    return {result: msg == "", message: msg};
  }

  nextItem() {
    var isDataValid = this.isEntryValid();
    
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }

    if (this.listItems[this.currentIndex] != undefined) {
      var _xItem: ItemDtlInfo = this.listItems[this.currentIndex];
      _xItem.propCode = this.uCode;
      _xItem.brand = this.itemSelectedNonGeneric.text;
      _xItem.model = this.model;
      _xItem.serial = this.serialNo;
      _xItem.subItems = this.subItemDataSource;

      this.listItems[this.currentIndex] = _xItem;
    } else {
      this.listItems.push({
        propCode: this.uCode,
        brand: this.itemSelectedNonGeneric.text,
        model: this.model,
        serial: this.serialNo,
        subItems: this.subItemDataSource
      });
    }

    this.currentIndex += 1;
    if (this.listItems[this.currentIndex] != undefined) {
      var _xItem: ItemDtlInfo = this.listItems[this.currentIndex];
      this.uCode = _xItem.propCode;
      this.itemSelectedNonGeneric.text = _xItem.brand;
      this.model = _xItem.model;
      this.serialNo = _xItem.serial;
      this.subItemDataSource = _xItem.subItems;
      if (this.subItemDataSource.length > 0) {
        this.withSubItem = true;
      } else {
        this.withSubItem = false;
      }
    } else {
      this.uCode = "";
      this.itemSelectedNonGeneric.text = "";
      this.model = "";
      this.serialNo = "";
      this.subItemDataSource = [];
      this.withSubItem = false;
    }
    this.displaySubItem();
  }
  
  previousItem() {
    if (this.listItems[this.currentIndex] != undefined) {
      var _xItem: ItemDtlInfo = this.listItems[this.currentIndex];
      _xItem.propCode = this.uCode;
      _xItem.brand = this.itemSelectedNonGeneric.text;
      _xItem.model = this.model;
      _xItem.serial = this.serialNo;
      _xItem.subItems = this.subItemDataSource;

      this.listItems[this.currentIndex] = _xItem;
    } else {
      this.listItems.push({
        propCode: this.uCode,
        brand: this.itemSelectedNonGeneric.text,
        model: this.model,
        serial: this.serialNo,
        subItems: this.subItemDataSource
      });
    }

    this.currentIndex -= 1;
    var _itemDtl: ItemDtlInfo = this.listItems[this.currentIndex];
    this.uCode = _itemDtl.propCode;
    this.itemSelectedNonGeneric.text = _itemDtl.brand;
    this.model = _itemDtl.model;
    this.serialNo = _itemDtl.serial;
    this.subItemDataSource = _itemDtl.subItems;
    if (this.subItemDataSource.length > 0) {
      this.withSubItem = true;
    } else {
      this.withSubItem = false;
    }
    this.displaySubItem();
  }

  addItem() {
    var isDataValid = this.isEntryValid();
    
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }
  
    var _propCode: string = "";
    var _modelx: string = "";
    var _serialx: string = "";
    var _brandx: string = "";

    if (this.isEquipment) {
      if (this.listItems[this.currentIndex] != undefined) {
        var _xItem: ItemDtlInfo = this.listItems[this.currentIndex];
        _xItem.propCode = this.uCode;
        _xItem.brand = this.itemSelectedNonGeneric.text;
        _xItem.model = this.model;
        _xItem.serial = this.serialNo;
        _xItem.subItems = this.subItemDataSource;
  
        this.listItems[this.currentIndex] = _xItem;
      } else {
        this.listItems.push({
          propCode: this.uCode,
          brand: this.itemSelectedNonGeneric.text,
          model: this.model,
          serial: this.serialNo,
          subItems: this.subItemDataSource
        });
      }
      var _sItemx: AcceptanceAndInspectionReportSubItemsModel[] = [];
      var _detailedItem: AcceptanceAndInspectionReportDetailedItemsModel[] = [];
  
      this.listItems.forEach((_itmDtl, index) => {
        if (index == 0) {
          _propCode = _itmDtl.propCode;
          _modelx = _itmDtl.model;
          _serialx = _itmDtl.serial;
          _brandx = _itmDtl.brand;
          _itmDtl.subItems.forEach((_subItem) => {
            _subItem.sItemIndex = index;
            _sItemx.push(_subItem);
          });
        } else {
          _propCode = _propCode + (_propCode != "" && _itmDtl.propCode != "" ? " | " : "") + _itmDtl.propCode;
          _modelx = _modelx + (_modelx != "" && _itmDtl.model != "" ? " | " : "") + _itmDtl.model;
          _serialx = _serialx + (_serialx != "" && _itmDtl.serial != "" ? " | " : "") + _itmDtl.serial;
          _brandx = _brandx + (_brandx != "" && _itmDtl.brand != "" ? " | " : "") + _itmDtl.brand;
          _itmDtl.subItems.forEach((_subItem) => {
            _subItem.sItemIndex = index;
            _sItemx.push(_subItem);
          });
        }
  
        _detailedItem.push(new AcceptanceAndInspectionReportDetailedItemsModel(
          _itmDtl.propCode,
          _itmDtl.brand,
          _itmDtl.model,
          _itmDtl.serial,
          _itmDtl.subItems
        ));
      });
    } else {
      _propCode = "";
      _modelx = this.model;
      _serialx = this.serialNo;
      _brandx = this.itemSelectedNonGeneric.text;
    }

    var item = new AcceptanceAndInspectionReportItemsModel(
      this.id,
      this.poItemId,
      this.itemType,
      this.itemTypeName,
      this.itemSelectedGeneric.value,
      this.itemSelectedGeneric.text,
      this.specification,
      this.unitMeasure,
      this.quantity,
      this.price,
      this.recQty,
      _brandx,
      this.itemSelectedNonGeneric.value,
      this.withExpiry ? this.expirationDate : null,
      this.withExpiry ? this.lotNo : "",
      this.remarks,
      _serialx,
      _modelx,
      _sItemx,
      this.balance,
      _propCode,
      _detailedItem
    );
    
    this.dialogRef.close(
      {
        item: item
      }
    );
  }

  expirationCheckedChanged(event: MatCheckboxChange) {
    this.withExpiry = event.checked;
    if (this.withExpiry) {
      this.expirationDate = new Date();
    } else {
      this.expirationDate = null;
    }
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
    
    if (this.subItemSelectedNonGeneric.text == "") {
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

    var item = new AcceptanceAndInspectionReportSubItemsModel(
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

  rowSelected(row: AcceptanceAndInspectionReportSubItemsModel) {
    this.selectedSubItem = row;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
