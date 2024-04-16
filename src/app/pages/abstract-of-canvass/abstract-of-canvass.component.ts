import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AbstractOfCanvassItemModel } from 'src/app/data-model/abstract-of-canvass-item-model';
import { AbstractOfCanvassModel } from 'src/app/data-model/abstract-of-canvass-model';
import { AbstractOfCanvassSupplierModel } from 'src/app/data-model/abstract-of-canvass-supplier-model';
import { RequestQuotationModel } from 'src/app/data-model/requestQuotationModel';
import { Supplier } from 'src/app/data-model/supplier-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { RfqSelectionDialogComponent } from './rfq-selection-dialog/rfq-selection-dialog.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  selectedData: AbstractOfCanvassModel;
  items: AbstractOfCanvassItemModel[];
  supplier: Supplier;
  selectedSuppliers: string[];
}

@Component({
  selector: 'app-abstract-of-canvass',
  templateUrl: './abstract-of-canvass.component.html',
  styleUrls: ['./abstract-of-canvass.component.css'],
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
export class AbstractOfCanvassComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  isLoading: boolean = false;
  displayedColumns: string[] = ['isExpanded', 'supplierName', 'address', 'contactNumber', 'action'];
  displayedItemColumns: string[] = ['description', 'remarks', 'uom', 'quantity', 'price', 'total'];
  suppliers: AbstractOfCanvassSupplierModel[] = [];
  nextIndex: number = 0
  selectedRfq: RequestQuotationModel;
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  aocId: string = "";
  employees: iEmp[];
  btnSaveText: string = "Save";

  transactionNo: string = "";
  transactionDate: Date = new Date();
  remarks: string = "";
  bacChairman: string = "";
  bacVChairman: string = ""; // End-User
  bacMember1: string = "";
  bacMember2: string = "";
  bacMember3: string = "";
  bacMember4: string = "";

  selectionBacChairman: iEmp[] = [];
  selectionBacMember1: iEmp[] = [];
  selectionBacMember2: iEmp[] = [];
  selectionBacMember3: iEmp[] = [];
  selectionBacMember4: iEmp[] = [];
  selectionUser: iEmp[] = [];

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<AbstractOfCanvassComponent>,
    private httpRequest: HttpRequestService
  ) {
    dialogRefx.disableClose = true;
  }

  async ngOnInit(): Promise<void> {
    this.employees = this.authService.listEmployee;
    var currUser = this.employees.find((x) => x.id == this.authService.getEmpId());
    this.bacVChairman = currUser.Fullname;

    this.loadDefaultSignatory();
    
    await this.getTransactionNo().then((result: boolean) => {
      if (result) {
        this.initParam();
      } else {
        this.notifService.showNotification(NotificationType.error, "Unable to fetch Transaction No. Please reload the page.");
      }
    });
  }

  initParam() {
    if (this.data) {
      this.initData(this.data.selectedData);
    }
    this.route.params.subscribe((param: Params) =>  {
      if (param['id']) {
        var paramId = param['id'];
        this.removeParam();
        this.httpRequest.getAbstractOfCanvassById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: AbstractOfCanvassModel) {
    this.aocId = data.id;
    this.transactionNo = data.transactionNo;
    this.transactionDate = data.transactionDate;
    this.remarks = data.remarks;
    this.bacChairman = data.bacChairman;
    this.bacVChairman = data.bacVChairman;
    this.bacMember1 = data.bacMember1;
    this.bacMember2 = data.bacMember2;
    this.bacMember3 = data.bacMember3;
    this.bacMember4 = data.bacMember4;

    data.supplier.forEach((item) => {
      this.suppliers.push(item);
      this.refreshTable();
    });

    this.httpRequest.getRequestQuotationById(data.rfqId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.selectedRfq = result.data;
      }
    });
    this.btnSaveText = "Update";
  }

  loadDefaultSignatory() {
    this.selectionBacChairman = this.authService.listDefaultSignatory.filter(s => s.type == "BAC Chairman");
    this.selectionUser = this.authService.listDefaultSignatory.filter(s => s.type == "GSO Head");
    this.selectionBacMember1 = this.authService.listDefaultSignatory.filter(s => s.type == "BAC Member 1");
    this.selectionBacMember2 = this.authService.listDefaultSignatory.filter(s => s.type == "BAC Member 2");
    this.selectionBacMember3 = this.authService.listDefaultSignatory.filter(s => s.type == "BAC Member 3");
    this.selectionBacMember4 = this.authService.listDefaultSignatory.filter(s => s.type == "BAC Member 4");
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getAbstractOfCanvassTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.transactionNo = result.data[0].transactionNo;
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }
  
  selectRFQ() {
    const dialogRef = this.dialog.open(RfqSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedRfq = result.requestQuotation;
      }
    });
  }

  addSupplier() {
    if (!this.selectedRfq) {
      this.notifService.showNotification(NotificationType.error, "Please select Canvass!");
      return;
    }
    var itms: AbstractOfCanvassItemModel[] = [];
    this.selectedRfq.items.forEach((item) => {
      itms.push(new AbstractOfCanvassItemModel(
        "",
        item.itemId,
        item.description,
        item.specification,
        item.uom,
        item.quantity,
        item.typeId,
        item.cost,
        item.cost,
        item.total,
        "",
        false,
        false,
        item.total,
      ));
    });
    const dialogRef = this.dialog.open(SupplierDetailsComponent, {
      data: {
        items: itms,
        selectedSuppliers: [...new Set(this.suppliers.map(supp => supp.supplierId))],
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var supp: AbstractOfCanvassSupplierModel = result.supplier;
        supp.supplierSeq = "Supplier" + (this.suppliers.length + 1);
        this.suppliers.push(supp);
        this.refreshTable();
      }
    });
  }

  editSupplier(index: number) {
    var selectedItemx: AbstractOfCanvassSupplierModel;
    selectedItemx = this.suppliers[index];
    var supp = new Supplier(
      selectedItemx.supplierId,
      selectedItemx.supplierName,
      selectedItemx.address,
      selectedItemx.contactNumber
    );
    const dialogRef = this.dialog.open(SupplierDetailsComponent, {
      data: {
        items: selectedItemx.items,
        supplier: supp,
        selectedSuppliers: [...new Set(this.suppliers.map(supp => supp.supplierId))],
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var supp: AbstractOfCanvassSupplierModel = result.supplier;
        supp.supplierSeq = "Supplier" + (this.suppliers.length + 1);
        this.suppliers.splice(index, 1, supp);
        this.refreshTable();
      }
    });
  }

  removeSupplier(index: number) {
    this.suppliers.splice(index, 1);
    this.refreshTable();
  }

  public calculateTotal(items: AbstractOfCanvassItemModel[]) {
    return items.reduce((accum, curr) =>  curr.itemId != '' ? accum + (curr.priceRead * curr.quantity) : accum, 0);
  }

  refreshTable() {
    let cloned = this.suppliers.slice();
    this.suppliers = cloned;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    // if (this.transactionNo == "") {
    //   msg = "Please input Transaction No.";
    // }
    if (this.suppliers.length == 0) {
      msg = "Please add Supplier/s.";
    }

    return {result: msg == "", message: msg};
  }

  preSaveConfirmation() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirm",
        message: "Are you sure do you want to save this transaction?",
        btnOkText: "Yes",
        btnCancelText: "No",
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveData();
      }
    });
  }

  saveData() {
    var isDataValid = this.isEntryValid();
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }
    if (this.isLoading) return;
    this.isLoading = true;
    var data = new AbstractOfCanvassModel(
      "",
      this.selectedRfq.id,
      this.selectedRfq.transactionNo,
      this.transactionNo,
      this.transactionDate,
      this.selectedRfq.supplyDescription,
      this.remarks,
      this.bacChairman,
      this.bacVChairman,
      this.bacMember1,
      this.bacMember2,
      this.bacMember3,
      this.bacMember4,
      this.suppliers
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveAbstractOfCanvass(data).subscribe((result) => {
        if (result.statusCode == 201) {
          this.notifService.showNotification(NotificationType.success, "Successfully saved!");
          if (this.envFirstLoad == "List") {
            this.saveUpdateSuccess();
          } else {
            this.clearFields();
          }
        } else {
          this.notifService.showNotification(NotificationType.error, "Saving Data Failed!");
        }
      });
    } else if (this.btnSaveText == "Update") {
      this.httpRequest.updateAbstractOfCanvass(this.aocId, data).subscribe((result) => {
        if (result.statusCode == 200) {
          this.notifService.showNotification(NotificationType.success, "Successfully updated!");
          if (this.envFirstLoad == "List") {
            this.saveUpdateSuccess();
          } else {
            this.clearFields();
          }
        } else {
          this.notifService.showNotification(NotificationType.error, "Updating Data Failed!");
        }
      });
    }
  }
  
  saveUpdateSuccess() {
    var result = true;
    this.dialogRefx.close(result);
  }
  
  clearFields() {
    this.selectedRfq = new RequestQuotationModel();
    this.suppliers = [];
    this.transactionNo = "";
    this.transactionDate = new Date();
    this.remarks = "";
    this.bacChairman = "";
    this.bacVChairman = "";
    this.bacMember1 = "";
    this.bacMember2 = "";
    this.bacMember3 = "";
    this.bacMember4 = "";
    this.isLoading = false;
    this.refreshTable();
    this.getTransactionNo();
    this.removeParam();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/abstract-of-canvass");
    }
  }

  gotoList() {
    this.router.navigate(["/abstract-of-canvass-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  selectEmployee(_type: string) {
    const dialogRef = this.dialog.open(EmployeeSelectionComponent, {
      data: {
        employees: this.employees
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.employee) {
        switch (_type) {
          case "bacChairman":
            this.bacChairman = result.employee.Fullname;
            break;
          case "bacVChairman":
            this.bacVChairman = result.employee.Fullname;
            break;
          case "bacMember1":
            this.bacMember1 = result.employee.Fullname;
            break;
          case "bacMember2":
            this.bacMember2 = result.employee.Fullname;
            break;
          case "bacMember3":
            this.bacMember3 = result.employee.Fullname;
            break;
          case "bacMember4":
            this.bacMember4 = result.employee.Fullname;
            break;
        }
      }
    });
  }
}
