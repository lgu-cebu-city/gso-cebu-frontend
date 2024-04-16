import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/data-model/item';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { NonInventoryItemItemXLSX } from './non-inventory-item.xlsx';

@Component({
  selector: 'app-non-inventory-item',
  templateUrl: './non-inventory-item.component.html',
  styleUrls: ['./non-inventory-item.component.css']
})
export class NonInventoryItemComponent implements OnInit {
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  displayedColumns: string[] = ['code', 'description', 'uom', 'price', 'action'];
  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
  listItemsPrint: Item[][] = [];
  nextIndex: number = 0
  isProcessing: boolean = false;
  viewCategory: string = "All";
  module = this;
  excelFormat = new NonInventoryItemItemXLSX();

  itemId: string = "";
  code: string = "";
  description: string = "";
  uom: string = "";
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
    this.getTransactionNo();
  }

  initForm() {
  }

  async ngAfterViewInit() {
    this.loadData();

    this.commonFunction.module = this.module;
    this.commonFunction.printFn = this.printFn;
    this.commonFunction.printBtn = this.printBtn;
    this.commonFunction.exportFn = this.exportToExcel;
  }

  getTransactionNo() {
    this.httpRequest.getItemTransactionNo("IG-").subscribe((result) => {
      if (result.statusCode == 200) {
        this.code = result.data[0].transactionNo;
      }
    });
  }

  loadData() {
    if (this.viewCategory == "All" ) {
      this.httpRequest.getListNonInvtyItem().subscribe((result) => {
        if (result.statusCode == 200) {
          this.dataSource = new MatTableDataSource<Item>(result.data);
          this.formatItemsPrint();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } else {
      this.httpRequest.getListNonInvtyItemByCategory(this.viewCategory).subscribe((result) => {
        if (result.statusCode == 200) {
          this.dataSource = new MatTableDataSource<Item>(result.data);
          this.formatItemsPrint();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    }
  }

  cloneItemsForPrint(items: Item[]): Item[] {
    var _retItems: Item[] = [];

    items.forEach(_item => {
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

  getPrintLength(currLen: number): number {
    var wholePage = Math.trunc(currLen / 40) * 40;
    var rem = currLen - wholePage;
    if (rem > 0) {
      wholePage += 40;
    }

    return wholePage;
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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
    if (!this.price) {
      msg = "Price must be greater than zero.";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    var isDataValid = this.isEntryValid();
    
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      this.isProcessing = false;
      return;
    }
    this.httpRequest.getListItemByItemCode(this.code).subscribe((res) => {
      if (res.data.length == 0 || res.data[0].id == this.itemId) {
        var tempItem: {
          code: string,
          description: string,
          uom: string,
          groupId: string,
          typeId: string,
          category: string,
          price: number
        } = {
          code: this.code,
          description: this.description,
          uom: this.uom,
          groupId: "",
          typeId: "",
          category: "Generic",
          price: this.price
        }
        if (this.btnSaveText == "Save") {
          this.httpRequest.addItem(tempItem).subscribe((result) => {
            this.clear();
            this.loadData();
            this.notifService.showNotification(NotificationType.success, "Successfully saved!");
          });
        } else if (this.btnSaveText == "Update") {
          this.httpRequest.updateItem(this.itemId, tempItem).subscribe((result) => {
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
    this.price = item.price;
    this.btnSaveText = "Update";
  }

  deleteData(item: Item) {
    this.httpRequest.deleteItem(item.id).subscribe((result) => {
      this.loadData();
      this.notifService.showNotification(NotificationType.success, "Successfully deleted!");
    });
  }

  clear() {
    this.itemId = "";
    this.code = "";
    this.description = "";
    this.uom = "";
    this.price = 0;
    this.btnSaveText = "Save";
    this.getTransactionNo();
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
