import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';
import { RequisitionAndIssuanceModel } from 'src/app/data-model/requisition-and-issuance-model';

@Component({
  selector: 'app-issuance-slip-print',
  templateUrl: './issuance-slip-print.component.html',
  styleUrls: ['./issuance-slip-print.component.css']
})
export class IssuanceSlipPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'description', 'requestedQty', 'issuedUnit', 'issuedQty', 'remarks'];
  @Input() risData: RequisitionAndIssuanceModel;
  @Input() risItemsData: RequisitionAndIssuanceItemModel[];
  datepipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  ngOnInit(): void {
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
}
