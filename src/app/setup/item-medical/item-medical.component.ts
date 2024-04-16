import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Item } from 'src/app/data-model/item';
import { Group } from 'src/app/data-model/group';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { MatRadioChange } from '@angular/material/radio';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { Type } from 'src/app/data-model/type';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { ItemXLSX } from '../item/item.xlsx';

@Component({
  selector: 'app-item-medical',
  templateUrl: './item-medical.component.html',
  styleUrls: ['./item-medical.component.css']
})
export class ItemMedicalComponent implements OnInit {
  formGroup: FormGroup;
  currentRowControl = new FormControl(0);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  displayedColumns: string[] = ['code', 'description', 'uom', 'typedesc', 'price', 'action'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
  listItemsPrint: Item[][] = [];
  typeSelection: Type[] = [];
  typeSelectionFiltered: Type[] = [];
  groupSelection: Group[] = [];
  itemTypeList: Type[];
  nextIndex: number = 0
  isProcessing: boolean = false;
  viewCategory: string = "All";
  module = this;
  excelFormat = new ItemXLSX();
  isShowLockedItems: boolean = false;
  listItems: Item[] = [];

  itemId: string = "";
  code: string = "";
  description: string = "";
  uom: string = "";
  type: string = "";
  group: string = "";
  category: string = "";
  price: number = 0;
  btnSaveText: string = "Save";

  constructor(
    public router: Router, 
    private notifService: NotificationService,
    public commonFunction: CommonFunctionService,
    private httpRequest: HttpRequestService
  ) { }
  
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.initForm();
    this.category = "Generic";
    this.getTransactionNo();
  }

  initForm() {
    this.formGroup = new FormGroup({
      code: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      uom: new FormControl("", [Validators.required]),
      groupId: new FormControl("", [Validators.required]),
      typeId: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      price: new FormControl(0, [Validators.required])
    });
  }

  async ngAfterViewInit() {
    this.loadItemType();
    this.loadData();
    this.loadSelectionData();

    this.commonFunction.module = this.module;
    this.commonFunction.printFn = this.printFn;
    this.commonFunction.printBtn = this.printBtn;
    this.commonFunction.exportFn = this.exportToExcel;
  }

  loadItemType() {
    this.httpRequest.getItemType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.itemTypeList = result.data;
      }
    });
  }

  getTransactionNo() {
    var _prefix: string = this.category == "Generic"? "IG-": "ING-";
    this.httpRequest.getItemTransactionNo(_prefix).subscribe((result) => {
      if (result.statusCode == 200) {
        this.code = result.data[0].transactionNo;
      }
    });
  }

  loadData() {
    if (this.viewCategory == "All" ) {
      this.httpRequest.getListAllMedicalItems().subscribe((result) => {
        if (result.statusCode == 200) {
          this.listItems = result.data;
          this.displayItems();
        }
      });
    } else {
      this.httpRequest.getListMedicalItemByCategory(this.viewCategory).subscribe((result) => {
        if (result.statusCode == 200) {
          this.listItems = result.data;
          this.displayItems();
        }
      });
    }
  }

  displayItems() {
    var retItems: Item[] = this.listItems;
    if (this.isShowLockedItems) {
      retItems = this.listItems.filter(itm => itm.status == 'Locked')
    }

    this.dataSource = new MatTableDataSource<Item>(retItems);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.formatItemsPrint();
  }

  cloneItemsForPrint(items: Item[]): Item[] {
    var _retItems: Item[] = [];

    items.forEach(_item => {
      if (_item.price > 0 && _item.status == 'Active') {
        _retItems.push(new Item(
          _item.id,
          _item.code,
          _item.description,
          _item.uom,
          _item.groupId,
          _item.groupdesc,
          _item.typeId,
          _item.typedesc,
          _item.category,
          _item.status,
          _item.quantity,
          _item.price,
          []
        ));
      }
    });

    return _retItems;
  }

  formatItemsPrint() {
    var items = this.cloneItemsForPrint(this.dataSource.data);

    var ctr: number = 1;
    items.forEach(_item => {
      if (_item.id != '-') {
        _item.id = ctr.toString();
        ctr += 1;
      }
    });
    
    var printItemsTemp: Item[] = [];
    this.listItemsPrint = [];
    var len: number = this.getPrintLength(items.length);
    for (var i = 0; i < len; i++) {
      if (items[i]) {
        printItemsTemp.push(items[i]);
      } else {
        var item = new Item("", "", "", "", "", "", "", "", "", "", 0, 0, []);
        printItemsTemp.push(item);
      }

      if (printItemsTemp.length >= 40) {
        this.listItemsPrint.push(printItemsTemp);
        printItemsTemp = [];
      }
    }
  }

  // formatItemsPrint() {
  //   var items = this.cloneItemsForPrint(this.dataSource.data);

  //   var itemsTemp: Item[] = [];
  //   this.itemTypeList.forEach((_type) => {
  //     var _typeItem: Item[] = items.filter(_item => _item.typeId == _type.id);
  //     if (_typeItem.length > 0) {
  //       itemsTemp.push(new Item(
  //         "-",
  //         "",
  //         _type.description,
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         0,
  //         0,
  //         []
  //       ));
  //       itemsTemp.push(... _typeItem);
  //     }
  //   });

  //   var ctr: number = 1;
  //   itemsTemp.forEach(_item => {
  //     if (_item.id != '-') {
  //       _item.id = ctr.toString();
  //       ctr += 1;
  //     }
  //   });
    
  //   var printItemsTemp: Item[] = [];
  //   this.listItemsPrint = [];
  //   var len: number = this.getPrintLength(itemsTemp.length);
  //   for (var i = 0; i < len; i++) {
  //     if (itemsTemp[i]) {
  //       printItemsTemp.push(itemsTemp[i]);
  //     } else {
  //       var item = new Item("", "", "", "", "", "", "", "", "", "", 0, 0, []);
  //       printItemsTemp.push(item);
  //     }

  //     if (printItemsTemp.length >= 40) {
  //       this.listItemsPrint.push(printItemsTemp);
  //       printItemsTemp = [];
  //     }
  //   }
  // }

  getPrintLength(currLen: number): number {
    var wholePage = Math.trunc(currLen / 40) * 40;
    var rem = currLen - wholePage;
    if (rem > 0) {
      wholePage += 40;
    }

    return wholePage;
  }

  loadSelectionData() {
    this.httpRequest.getItemGroupWithType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.groupSelection = result.data;
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

  categorySelectedValue(event: MatSelectChange) {
    this.getTransactionNo();
  }

  typeSelectedValue(event: MatSelectChange) {
    if (event.value) {
      this.typeSelectionFiltered = this.groupSelection.find(g => g.id == event.value).type.filter(x => x.isMedicine == "1");
    } else {
      this.typeSelectionFiltered = [];
    }
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (!this.code) {
      msg = "Please input Item Code";
    }
    if (!this.description) {
      msg = "Please input Description";
    }
    if (!this.uom) {
      msg = "Please input Unit of Measurement";
    }
    if (!this.group) {
      msg = "Please select Item Group";
    }
    if (!this.type) {
      msg = "Please select Item Type";
    }
    if (!this.category) {
      msg = "Please select Item Category";
    }
    if (!this.price) {
      msg = "Price must be greater than zero.";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    var isDataValid = this.isEntryValid();
    
    if (this.formGroup.valid && !isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      this.isProcessing = false;
      return;
    }
    this.httpRequest.getListItemByItemCode(this.code).subscribe((res) => {
      if (res.data.length == 0 || res.data[0].id == this.itemId) {
        if (this.btnSaveText == "Save") {
          this.httpRequest.addItem(this.formGroup.value).subscribe((result) => {
            this.clear();
            this.loadData();
            this.notifService.showNotification(NotificationType.success, "Successfully saved!");
          });
        } else if (this.btnSaveText == "Update") {
          this.httpRequest.updateItem(this.itemId, this.formGroup.value).subscribe((result) => {
            this.clear();
            this.loadData();
            this.notifService.showNotification(NotificationType.success, "Successfully updated!");
          });
        }
      } else {
        this.notifService.showNotification(NotificationType.error, "Item Code already exist.");
      }
    });
    this.isProcessing = false;
  }

  editData(item: Item) {
    this.itemId = item.id.toString();
    this.code = item.code.toString();
    this.description = item.description.toString();
    this.uom = item.uom.toString();
    this.group = item.groupId.toString();
    this.typeSelectionFiltered = this.groupSelection.find(g => g.id == this.group).type;
    this.type = item.typeId.toString();
    this.category = item.category.toString();
    this.price = item.price;
    this.btnSaveText = "Update";
  }

  deleteData(item: Item) {
    this.httpRequest.deleteItem(item.id).subscribe((result) => {
      this.loadData();
      this.notifService.showNotification(NotificationType.success, "Successfully deleted!");
    });
  }

  lockItem(item: Item) {
    this.httpRequest.lockItem(item.id, item.status == "Active" ? "Locked" : "Active").subscribe((result) => {
      this.loadData();
      this.notifService.showNotification(NotificationType.success, "Status successfully updated!");
    });
  }

  clear() {
    this.formGroup.reset();
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.setErrors(null) ;
    });
    this.typeSelectionFiltered = [];
    this.itemId = "";
    this.btnSaveText = "Save";
    this.formGroup.controls['category'].setValue("Generic");
    this.getTransactionNo();
  }

  catDisplayChange(event: MatRadioChange) {
    this.viewCategory = event.value;
    this.loadData();
  }

  printFn(){
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  exportToExcel() {
    var _listItems: Item[] = [];
    this.module.listItemsPrint.forEach(_items => {
      _listItems.push(... _items);
    })
    this.module.excelFormat.generateXLSXFormat(_listItems);
  }
}
