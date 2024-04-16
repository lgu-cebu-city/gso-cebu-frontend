import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InventoryPropertyModel } from 'src/app/data-model/inventory-property-model';
import { InventoryReportDetailsModel } from 'src/app/data-model/inventory-report-details-model';
import { InventorySSMIModel } from 'src/app/data-model/inventory-ssmi-model';
import { ReportSelectionComponent } from 'src/app/report-selection/report-selection.component';
import { AuthService } from 'src/app/services/auth.service';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventory-property',
  templateUrl: './inventory-property.component.html',
  styleUrls: ['./inventory-property.component.css']
})
export class InventoryPropertyComponent implements OnInit {
  env = environment;
  displayedColumns: string[] = ['itemCode', 'description', 'brand', 'serialNo', 'model', 'uom', 'type'];
  irList: InventoryPropertyModel[] = [];
  displayedColumnsItemDetails: string[] = ['referenceNo', 'referenceDate', 'method', 'quantity', 'unit'];
  details: InventoryReportDetailsModel[] = [];
  detailsPrint: InventoryReportDetailsModel[] = [];
  dataSource: MatTableDataSource<InventoryPropertyModel> = new MatTableDataSource<InventoryPropertyModel>(this.irList);
  selectedIr: InventoryPropertyModel;
  datepipe: DatePipe = new DatePipe('en-US');
  ssmiData: InventorySSMIModel[] = [];
  module = this;

  constructor(
    private authService: AuthService,
    private httpRequest: HttpRequestService,
    public commonFunction: CommonFunctionService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;
  @ViewChild('printPropertyCardButton') printPropertyCardBtn: ElementRef<HTMLElement>;
  @ViewChild('printPropertyCardCOAButton') printPropertyCardCOABtn: ElementRef<HTMLElement>;
  @ViewChild('printPropertyLedgerCOAButton') printPropertyLedgerCOABtn: ElementRef<HTMLElement>;
  @ViewChild('printSSMIButton') printSSMIBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.commonFunction.printFn = this.printInventoryReport;
    // this.commonFunction.printPropertyCardFn = this.printPropertyCard;
    this.commonFunction.module = this.module;
    // this.commonFunction.printBtn = this.printBtn;
    // this.commonFunction.printPropertyCardBtn = this.printPropertyCardBtn;

    if (this.authService.getUserName() == "responsivadmin") {
      // this.commonFunction.printPropertyLedgerFn = this.printPropertyLedgerFn;
      // this.commonFunction.printPropertyLedgerCOABtn = this.printPropertyLedgerCOABtn;
    }
  }

  loadData() {
    this.httpRequest.getAllPropertyInventory().subscribe((result) => {
      if (result.statusCode == 200) {
        this.irList = result.data;
        this.dataSource = new MatTableDataSource<InventoryPropertyModel>(this.irList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.irList.length) {
          this.selectedIr = this.irList[0];
          // this.details = this.irList[0].details;
          // this.loadItemsForPrint(this.irList[0].details);
        }
      }
    });
  }

  loadItemsForPrint(d: InventoryReportDetailsModel[]) {
    this.detailsPrint = [];
    var runningBalance: number = 0;
    for (var i = 0; i < 20; i++) {
      var item: InventoryReportDetailsModel;
      if (d[i]) {
        if (d[i].method == "+") {
          runningBalance += d[i].reportQty;
        } else if (d[i].method == "-") {
          runningBalance -= d[i].reportQty;
        }
        d[i].runningBalance = runningBalance;

        item = d[i];
      } else {
        item = new InventoryReportDetailsModel(
          "",
          "",
          "",
          new Date(),
          "",
          0,
          0,
          "",
          0
        );
      }
      this.detailsPrint.push(item);
    }
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  rowSelected(row: InventoryPropertyModel) {
    this.selectedIr = row;
    // this.details = row.details;
    // this.loadItemsForPrint(row.details);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  formatNumber(value: number): string {
    return Number(value).toFixed(2);
  }

  generateSSMIForPrint() {
    var ssmiData_temp: InventorySSMIModel[] = [];
    for (var i = 0; i < 10; i++) {
      if (this.ssmiData[i]?.description) {
        ssmiData_temp.push(this.ssmiData[i]);
        ssmiData_temp[i].code = (i+1).toString();
      } else if (this.ssmiData.length == i) {
        ssmiData_temp.push(new InventorySSMIModel(
          "",
          "",
          "*** Nothing Follows ***",
          "",
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ));
      } else {
        ssmiData_temp.push(new InventorySSMIModel(
          "",
          "",
          "",
          "",
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ));
      }
    }
    this.ssmiData = ssmiData_temp;
  }

  printPropertyCard(){
    this.module.selectedIr = this.module.selectedIr;
    // this.module.loadItemsForPrint(this.module.selectedIr.details);

    const dialogRef = this.module.dialog.open(ReportSelectionComponent, {
      data: "Property Card",
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "COA") {
        setTimeout(() => 
        {
          let el: HTMLElement = this.module.printPropertyCardCOABtn.nativeElement;
          el.click();
        },
        500);
      } else if (result.data == "") {
        setTimeout(() => 
        {
          let el: HTMLElement = this.module.printPropertyCardBtn.nativeElement;
          el.click();
        },
        500);
      }
    });
  }

  printInventoryReport(){
    this.module.selectedIr = this.module.selectedIr;
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  printPropertyLedgerFn(){
    this.module.selectedIr = this.module.selectedIr;
    setTimeout(() => 
    {
      let el: HTMLElement = this.printPropertyLedgerCOABtn.nativeElement;
      el.click();
    },
    500);
  }
}
