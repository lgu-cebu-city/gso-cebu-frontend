import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RequestQuotationItemsModel } from 'src/app/data-model/request-quotation-items-model';
import { RequestQuotationModel } from 'src/app/data-model/requestQuotationModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rfq-print',
  templateUrl: './rfq-print.component.html',
  styleUrls: ['./rfq-print.component.css']
})
export class RfqPrintComponent implements OnInit {
  displayedColumnsItemDetails: string[] = ['itemNo', 'uom', 'description', 'quantity', 'cost', 'total'];
  @Input() rfqData: RequestQuotationModel;
  @Input() rfqItemsData: RequestQuotationItemsModel[];
  @Input() currPage: number;
  @Input() maxPage: number;
  @Input() grandTotal: number;
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  bacChairman: string = "";
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.bacChairman = this.authService.listDefaultSignatory.filter(s => s.type == "BAC Chairman")[0].Fullname;
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  formatTime(value: any): string {
    return this.datepipe.transform(value, 'h:mm a') || "";
  }
}
