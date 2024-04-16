import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AcknowledgementReceiptItemsModel } from 'src/app/data-model/acknowledgment-receipt-items-model';
import { AcknowledgementReceiptModel } from 'src/app/data-model/acknowledgment-receipt-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';

@Component({
  selector: 'app-acknowledgment-receipt-of-equipment-print',
  templateUrl: './acknowledgment-receipt-of-equipment-print.component.html',
  styleUrls: ['./acknowledgment-receipt-of-equipment-print.component.css']
})
export class AcknowledgmentReceiptOfEquipmentPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['quantity','uom','brand','propertyNo','dateAcquired','price'];
  datepipe: DatePipe = new DatePipe('en-US');
  totalAmount: number = 0.00;
  receivedByPosition: string = "";
  issuedByPosition: string = "";
  
  @Input() areData: AcknowledgementReceiptModel;
  @Input() areItemsData: AcknowledgementReceiptItemsModel[];
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.totalAmount = 0.00;
    if (this.areItemsData) {
      this.areItemsData.forEach(item => {
        this.totalAmount += item.price * item.quantity;
      });
    };

    this.getPosition();
  }

  getPosition() {
    var rbp = this.authService.listEmployee.find(e => e.id == this.areData.receivedById)?.Position;
    var ibp = this.authService.listEmployee.find(e => e.id == this.areData.issuedById)?.Position;
    this.receivedByPosition = rbp || "";
    this.issuedByPosition = ibp || "";
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
