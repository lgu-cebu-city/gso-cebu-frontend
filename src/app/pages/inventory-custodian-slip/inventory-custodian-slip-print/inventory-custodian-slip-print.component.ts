import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InventoryCustodianSlipItemsModel } from 'src/app/data-model/inventory-custodian-slip-items-model';
import { InventoryCustodianSlipModel } from 'src/app/data-model/inventory-custodian-slip-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';

@Component({
  selector: 'app-inventory-custodian-slip-print',
  templateUrl: './inventory-custodian-slip-print.component.html',
  styleUrls: ['./inventory-custodian-slip-print.component.css']
})
export class InventoryCustodianSlipPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['quantity', 'uom', 'price', 'totalCost', 'description', 'propertyNo', 'remarks'];
  @Input() icsData: InventoryCustodianSlipModel;
  @Input() icsDetailsData: InventoryCustodianSlipItemsModel[];
  totalAmount: number = 0.00;
  datepipe: DatePipe = new DatePipe('en-US');
  receivedFromPosition: string = "";
  receivedByPosition: string = "";

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.totalAmount = 0.00;
    if (this.icsDetailsData) {
      this.icsDetailsData.forEach(item => {
        this.totalAmount += item.price * item.quantity;
      });
    };

    this.getPosition();
  }

  getPosition() {
    var rfp = this.authService.listEmployee.find(e => e.id == this.icsData.receivedFromId)?.Position;
    var rbp = this.authService.listEmployee.find(e => e.id == this.icsData.receivedById)?.Position;
    this.receivedFromPosition = rfp || "";
    this.receivedByPosition = rbp || "";
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
