import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PurchaseOrderItemModel } from 'src/app/data-model/purchase-order-item-model';
import { PurchaseOrderModel } from 'src/app/data-model/purchase-order-model';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-purchase-order-print',
  templateUrl: './purchase-order-print.component.html',
  styleUrls: ['./purchase-order-print.component.css']
})
export class PurchaseOrderPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['itemNo', 'uom', 'description', 'quantity', 'unitCost', 'amount'];
  @Input() poData: PurchaseOrderModel;
  @Input() poItemsData: PurchaseOrderItemModel[];
  @Input() currPage: number;
  @Input() maxPage: number;
  @Input() grandTotal: number;
  totalAmountString: string = "";
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
  converter = require('number-to-words');
  employees: iEmp[];
  cityMayor: string = "";
  
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.employees = this.authService.listEmployee;
    var mayor = this.employees.find((x) => x.positionId == environment.cityMayorPositionId);
    this.cityMayor = mayor.Fullname;
  }

  ngOnChanges() {
    var dec = this.grandTotal.toString().split(".")[1];
    this.totalAmountString = this.converter.toWords(this.grandTotal) + (dec ? (" " + dec + "/100"): "");
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
