import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PropertyTransfer } from 'src/app/data-model/property-transfer-model';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';

@Component({
  selector: 'app-transfer-withdrawal-print',
  templateUrl: './transfer-withdrawal-print.component.html',
  styleUrls: ['./transfer-withdrawal-print.component.css']
})
export class TransferWithdrawalPrintComponent implements OnInit {
  @Input() ptData: PropertyTransfer;
  @Input() ptItemsData: RequisitionAndIssuanceItemModel[];
  displayedColumnsItemDetails: string[] = ['itemCode', 'issuedUnit', 'description', 'issuedQty'];
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
