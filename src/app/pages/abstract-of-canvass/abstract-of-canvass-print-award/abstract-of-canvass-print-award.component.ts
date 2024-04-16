import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractOfCanvassModel } from 'src/app/data-model/abstract-of-canvass-model';
import { TransactionModel } from 'src/app/data-model/transaction-model';

@Component({
  selector: 'app-abstract-of-canvass-print-award',
  templateUrl: './abstract-of-canvass-print-award.component.html',
  styleUrls: ['./abstract-of-canvass-print-award.component.css']
})
export class AbstractOfCanvassPrintAwardComponent implements OnInit {
  @Input() aocData: AbstractOfCanvassModel;
  @Input() transactionData: TransactionModel;
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemAmount: number = 0.00;
  itemAmountString: string = "";
  converter = require('number-to-words');

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges() {
    this.itemAmount = 0.00;
    if (this.aocData) {
      this.aocData.supplier.forEach(supp => {
        if (supp.approved) {
          supp.items.forEach(item => {
            if (item.awarded) {
              this.itemAmount += item.price * item.quantity;
            }
          })
        }
      })
    };

    var dec = this.itemAmount.toString().split(".")[1];
    this.itemAmountString = this.converter.toWords(this.itemAmount) + (dec ? (" " + dec + "/100"): "");
  }

  formatNumber(value: any): string {
    return this.numberFormat.format(value);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

}
