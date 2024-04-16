import { animate, state, style, transition, trigger } from '@angular/animations';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Group } from 'src/app/data-model/group';
import { InventoryMedicineModel } from 'src/app/data-model/inventory-medicine-model';
import { InventorySSMIModel } from 'src/app/data-model/inventory-ssmi-model';
import { Item } from 'src/app/data-model/item';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';

interface MedicineGenericNode {
  id: string;
  name: string;
  count: number;
  children: MedicineNonGenericNode[];
  isExpanded: boolean;
}
interface MedicineNonGenericNode {
  id: string;
  name: string;
  count: number;
  children: MedicineLotNoNode[];
  isExpanded: boolean;
}
interface MedicineLotNoNode {
  lotNo: string;
  expirationDate: Date;
}

@Component({
  selector: 'app-medicine-expiration-monitoring',
  templateUrl: './medicine-expiration-monitoring.component.html',
  styleUrls: ['./medicine-expiration-monitoring.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'unset' })),
      transition('expanded <=> collapsed', 
        animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class MedicineExpirationMonitoringComponent implements OnInit {
  env = environment;
  displayedColumns: string[] = ['code', 'description', 'uom', 'quantity', 'lotNo', 'expirationDate'];
  displayedColumnsTest: string[] = ['action', 'name', 'count'];
  displayedColumnsssTest: string[] = ['lotNo', 'expirationDate'];
  irList: InventoryMedicineModel[] = [];
  dataSource: MatTableDataSource<InventoryMedicineModel> = new MatTableDataSource<InventoryMedicineModel>(this.irList);
  selectedIr: InventoryMedicineModel;
  datepipe: DatePipe = new DatePipe('en-US');
  ssmiData: InventorySSMIModel[] = [];
  groupType: Group[];
  itemType: string = "";
  module = this;

  dataSourceTest: MatTableDataSource<MedicineGenericNode> = new MatTableDataSource<MedicineGenericNode>([]);

  constructor(
    private httpRequest: HttpRequestService,
    public commonFunction: CommonFunctionService,
    public router: Router
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.loadData();
    this.loadGroupType();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.commonFunction.printFn = this.printInventoryReport;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
  }

  loadData() {
    this.httpRequest.getAllMedicineInventory().subscribe((result) => {
      if (result.statusCode == 200) {
        this.irList = result.data;
        this.dataSource = new MatTableDataSource<InventoryMedicineModel>(this.irList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.irList.length) {
          this.selectedIr = this.irList[0];
        }
      }
    });
    this.httpRequest.getAllMedicineInventoryTest().subscribe((result) => {
      if (result.statusCode == 200) {
        this.formatMedicineList(result.data);
      }
    });
  }

  formatMedicineList(items: Item[]) {
    var dispItems: MedicineGenericNode[] = [];
    items.forEach((item: Item) => {
      var medGen: MedicineGenericNode = {
        id: item.id,
        name: item.description,
        count: item.ledger.map(l => l.brandId = item.id).length,
        children: [],
        isExpanded: false
      };
      
      dispItems.push(medGen);

      var medNonGenDisp: MedicineNonGenericNode[] = [];
      item.ledger.forEach((ledger: InventoryMedicineModel) => {
        var medNonGen: MedicineNonGenericNode;
        var medLotNode: MedicineLotNoNode;

        if (medNonGenDisp.length == 0) {
          medNonGen = {
            id: ledger.brandId,
            name: ledger.description,
            count: item.ledger.map(l => l.brandId = ledger.brandId).length,
            children: [],
            isExpanded: false
          }
          medLotNode = {
            lotNo: ledger.lotNo,
            expirationDate: ledger.expirationDate
          }
          medNonGen.children.push(medLotNode);
          medNonGenDisp.push(medNonGen);
        } else {
          var currLen: number = medNonGenDisp.length-1;
          if (medNonGenDisp[currLen].id = ledger.brandId) {
            medLotNode = {
              lotNo: ledger.lotNo,
              expirationDate: ledger.expirationDate
            }
            medNonGenDisp[currLen].children.push(medLotNode);
          } else {
            medNonGen = {
              id: ledger.brandId,
              name: ledger.description,
              count: item.ledger.map(l => l.brandId = ledger.brandId).length,
              children: [],
              isExpanded: false
            }
            medLotNode = {
              lotNo: ledger.lotNo,
              expirationDate: ledger.expirationDate
            }
            medNonGen.children.push(medLotNode);
            medNonGenDisp.push(medNonGen);
          }
        }
      });

      dispItems[dispItems.length-1].children = medNonGenDisp;
    });
    this.dataSourceTest = new MatTableDataSource<MedicineGenericNode>(dispItems);
  }

  loadGroupType() {
    this.httpRequest.getItemGroupWithType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.groupType = result.data;
      }
    });
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceTest.filter = filterValue;
    
    this.dataSourceTest.filterPredicate = (data: any, filter) => {
      const dataStr =JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1; 
    }
  }

  rowSelected(row: InventoryMedicineModel) {
    this.selectedIr = row;
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

  setThreshold() {
    
  }
  
  hasExpiredHeader(_item: MedicineGenericNode): boolean {
    return _item.children.filter(_sItem => _sItem.children.filter(_dItem => new Date(_dItem.expirationDate) < new Date())).length > 0;
  }
  
  hasExpiredChild(_item: MedicineLotNoNode): boolean {
    return new Date(_item.expirationDate) < new Date();
  }

  printInventoryReport(){
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }
}
