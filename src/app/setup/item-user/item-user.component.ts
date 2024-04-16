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
  selector: 'app-item-user',
  templateUrl: './item-user.component.html',
  styleUrls: ['./item-user.component.css']
})
export class ItemUserComponent implements OnInit {
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  displayedColumns: string[] = ['code', 'description', 'uom', 'typedesc', 'price'];
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
  }

  initForm() {
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

  loadData() {
    if (this.viewCategory == "All" ) {
      this.httpRequest.getListItem().subscribe((result) => {
        if (result.statusCode == 200) {
          this.listItems = result.data;
          this.displayItems();
        }
      });
    } else {
      this.httpRequest.getListItemByCategory(this.viewCategory).subscribe((result) => {
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
