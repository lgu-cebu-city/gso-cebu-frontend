import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {

  createFn: Function;
  editFn: Function;
  deleteFn: Function;
  printFn: Function;
  printPreviewFn: Function;
  exportFn: Function;
  printCanvassSheetFn: Function;
  printSummaryFn: Function;
  printStockCardFn: Function;
  printSSMIFn: Function;
  printPropertyCardFn: Function;
  printPropertyLedgerFn: Function;
  printAprFn: Function;
  module: any;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;
  @ViewChild('printCanvassSheetButton') printCanvassSheetBtn: ElementRef<HTMLElement>;
  @ViewChild('printSummaryButton') printSummaryBtn: ElementRef<HTMLElement>;
  @ViewChild('printStockCardButton') printStockCardBtn: ElementRef<HTMLElement>;
  @ViewChild('printSSMIButton') printSSMIBtn: ElementRef<HTMLElement>;
  @ViewChild('printPropertyCardButton') printPropertyCardBtn: ElementRef<HTMLElement>;
  @ViewChild('printPropertyLedgerCOAButton') printPropertyLedgerCOABtn: ElementRef<HTMLElement>;
  @ViewChild('printAprButton') printAprBtn: ElementRef<HTMLElement>;
  public dialog: MatDialog;

  constructor() { }
}
