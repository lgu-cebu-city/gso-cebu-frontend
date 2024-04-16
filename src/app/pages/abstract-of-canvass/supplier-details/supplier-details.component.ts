import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { AbstractOfCanvassItemModel } from 'src/app/data-model/abstract-of-canvass-item-model';
import { AbstractOfCanvassSupplierModel } from 'src/app/data-model/abstract-of-canvass-supplier-model';
import { Supplier } from 'src/app/data-model/supplier-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { DialogData } from '../abstract-of-canvass.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.css']
})
export class SupplierDetailsComponent implements OnInit {
  currentRowControl = new FormControl(0);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  displayedColumns: string[] = ['description', 'remarks', 'uom', 'quantity', 'price', 'total'];
  dataSource: MatTableDataSource<AbstractOfCanvassItemModel> = new MatTableDataSource<AbstractOfCanvassItemModel>([]);
  supplierSelection: Supplier[];
  selectedSupplier: Supplier;
  supp: string = "";
  nextIndex: number = 0;
  textFilterStr: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<SupplierDetailsComponent>,
    private notifService : NotificationService,
    private httpRequest: HttpRequestService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    var data: AbstractOfCanvassItemModel[] = this.data.items.filter(item => item.quantity > 0);
    this.dataSource = new MatTableDataSource<AbstractOfCanvassItemModel>(data);
    this.loadSupplier();
    if (this.data.supplier) {
      this.selectedSupplier = this.data.supplier;
      this.supp = this.data.supplier.id;
    }
  }

  loadSupplier() {
    this.httpRequest.getSupplierAll().subscribe((result) => {
      if (result.statusCode == 200) {
        this.supplierSelection = result.data;
      }
    });
  }

  recompute(item: AbstractOfCanvassItemModel) {
    if (item.price < item.priceRead) {
      this.notifService.showNotification(NotificationType.error, "<b>" + item.description + "</b> price must not be greater than <b>" + this.numberFormat.format(item.price) + "</b>!");
      item.priceRead = item.price;
    }
    item.priceCalculated = item.priceRead * item.quantity;
    this.calculateTotal();
  }

  supplierSelectedValue(event: MatSelectChange) {
    var supplier = this.supplierSelection.find((s) => s.id == event.value);
    if (supplier) {
      this.selectedSupplier = supplier;
    }
  }

  addSupplier() {
    var _items = this.dataSource.data.filter(_i => _i.priceRead == 0);
    if (_items.length > 0) {
      this.notifService.showNotification(NotificationType.error, "<b>" + _items[0].description + "</b> has 0 price!");
      return;
    }

    if (!this.selectedSupplier) {
      this.notifService.showNotification(NotificationType.error, "Please select supplier!");
      return;
    }
    if (this.data.selectedSuppliers.find(supp => supp == this.selectedSupplier.id) && this.selectedSupplier.id != this.data.supplier.id) {
      this.notifService.showNotification(NotificationType.error, "Selected Supplier is already added.");
      return;
    }
    var supp = new AbstractOfCanvassSupplierModel(
      "",
      "",
      this.selectedSupplier.id,
      this.selectedSupplier.name,
      this.selectedSupplier.address,
      this.selectedSupplier.contactNumber,
      false,
      false,
      this.dataSource.data
    )
    this.dialogRef.close(
      {
        supplier: supp
      }
    );
  }

  public calculateTotal() {
    return this.dataSource.data?.reduce((accum, curr) =>  curr.itemId != '' ? accum + curr.priceCalculated : accum, 0);
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
