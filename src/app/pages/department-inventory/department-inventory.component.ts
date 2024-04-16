import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Group } from 'src/app/data-model/group';
import { InventoryReportDetailsModel } from 'src/app/data-model/inventory-report-details-model';
import { InventoryReportModel } from 'src/app/data-model/inventory-report-model';
import { InventorySSMIModel } from 'src/app/data-model/inventory-ssmi-model';
import { AuthService } from 'src/app/services/auth.service';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-department-inventory',
  templateUrl: './department-inventory.component.html',
  styleUrls: ['./department-inventory.component.css']
})
export class DepartmentInventoryComponent implements OnInit {
  env = environment;
  displayedColumns: string[] = ['itemCode', 'description', 'uom', 'type', 'receivedQty', 'withdrawnQty', 'returnQty', 'onhandQty'];
  irList: InventoryReportModel[] = [];
  displayedColumnsItemDetails: string[] = ['referenceNo', 'referenceDate', 'method', 'quantity', 'unit'];
  details: InventoryReportDetailsModel[] = [];
  detailsPrint: InventoryReportDetailsModel[] = [];
  dataSource: MatTableDataSource<InventoryReportModel> = new MatTableDataSource<InventoryReportModel>(this.irList);
  selectedIr: InventoryReportModel;
  datepipe: DatePipe = new DatePipe('en-US');
  ssmiData: InventorySSMIModel[] = [];
  groupType: Group[];
  itemType: string = "";
  module = this;

  constructor(
    public authService: AuthService,
    private httpRequest: HttpRequestService,
    public commonFunction: CommonFunctionService,
    public router: Router
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;
  @ViewChild('printStockCardButton') printStockCardBtn: ElementRef<HTMLElement>;
  @ViewChild('printSSMIButton') printSSMIBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.loadData();
    this.loadGroupType();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.commonFunction.printFn = this.printInventoryReport;
    this.commonFunction.printStockCardFn = this.printStockCard;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
    this.commonFunction.printStockCardBtn = this.printStockCardBtn;
    if (this.authService.getTypeId() == this.env.gsoDeptId.toString()) {
      this.commonFunction.printSSMIFn = this.printSSMI;
      this.commonFunction.printSSMIBtn = this.printSSMIBtn;
    }
  }

  loadData() {
    var _deptId: string = this.authService.getTypeId();
    if (this.itemType) {
      this.httpRequest.getAllInventoryReportbyType(this.itemType, _deptId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.irList = result.data;
          this.dataSource = new MatTableDataSource<InventoryReportModel>(this.irList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.irList.length) {
            this.selectedIr = this.irList[0];
            this.details = this.irList[0].details;
            this.loadItemsForPrint(this.irList[0].details);
          }
        }
      });
    } else {
      this.httpRequest.getAllInventoryReport(_deptId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.irList = result.data;
          this.dataSource = new MatTableDataSource<InventoryReportModel>(this.irList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.irList.length) {
            this.selectedIr = this.irList[0];
            this.details = this.irList[0].details;
            this.loadItemsForPrint(this.irList[0].details);
          }
        }
      });
    }
  }

  loadGroupType() {
    this.httpRequest.getItemGroupWithType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.groupType = result.data;
      }
    });
  }

  typeSelectionChanged(event: MatSelectChange) {
    this.itemType = event.source.value;
    this.loadData();
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

  rowSelected(row: InventoryReportModel) {
    this.selectedIr = row;
    this.details = row.details;
    this.loadItemsForPrint(row.details);
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

  printSSMI(){
    this.module.httpRequest.getSSMIReport((new Date()).getFullYear()).subscribe((result) => {
      if (result.statusCode == 200) {
        this.module.ssmiData = result.data[0];
        this.module.generateSSMIForPrint();

        setTimeout(() => 
        {
          let el: HTMLElement = this.printSSMIBtn.nativeElement;
          el.click();
        },
        500);
      }
    });
  }

  printStockCard(){
    this.module.selectedIr = this.module.selectedIr;
    this.module.loadItemsForPrint(this.module.selectedIr.details);
    setTimeout(() => 
    {
      let el: HTMLElement = this.printStockCardBtn.nativeElement;
      el.click();
    },
    500);
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
}
