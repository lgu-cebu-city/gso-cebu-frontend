import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AcceptanceAndInspectionReportItemsModel } from 'src/app/data-model/acceptance-and-inspection-report-items-model';
import { AcceptanceAndInspectionReportModel } from 'src/app/data-model/acceptance-and-inspection-report-model';
import { Department } from 'src/app/data-model/department';
import { Item } from 'src/app/data-model/item';
import { PurchaseOrderModel } from 'src/app/data-model/purchase-order-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { Type } from 'src/app/data-model/type';
import { ItemSetupDialogComponent } from '../acceptance-and-inspection-report/item-setup-dialog/item-setup-dialog.component';
import { ListItemDialogComponent } from '../acceptance-and-inspection-report/list-item-dialog/list-item-dialog.component';
import { AddItemDialogComponent } from '../acceptance-and-inspection-report/add-item-dialog/add-item-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { ActualPoSelectionDialogComponent } from './actual-po-selection-dialog/actual-po-selection-dialog.component';

export interface DialogData {
  selectedData: AcceptanceAndInspectionReportModel;
  itemCategory: string,
  itemType: string,
  itemUom: string,
  itemDescription: string,
  currentItemId: string,
  typeList: Type[];
  selectedItem: AcceptanceAndInspectionReportItemsModel;
}

@Component({
  selector: 'app-inspection-and-acceptance-report-actual',
  templateUrl: './inspection-and-acceptance-report-actual.component.html',
  styleUrls: ['./inspection-and-acceptance-report-actual.component.css']
})
export class InspectionAndAcceptanceReportActualComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  isLoading: boolean = false;
  nonGenericItemControl = new FormControl('');
  genericItemControl = new FormControl('');
  displayedColumns: string[] = ['no', 'uom', 'price', 'quantity', 'receivedQuantity', 'balance', 'description', 'brand', 'serialNo', 'model'];
  displayedColumnsWithAction: string[] = ['no', 'uom', 'price', 'quantity', 'receivedQuantity', 'balance', 'description', 'brand', 'serialNo', 'model', 'action'];
  displayedSubItemColumns: string[] = ['uom', 'quantity', 'description', 'serialNo', 'model'];
  dataSource: AcceptanceAndInspectionReportItemsModel[] = [];
  nextIndex: number = 0
  selectedPo: PurchaseOrderModel = null;
  departmentSelection: Department[] = [];
  nonGenericItems: Item[] = [];
  genericItems: Item[] = [];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  btnSaveText: string = "Save";
  employees: iEmp[];

  iarId: string = "";
  invoiceNo: string = "";
  invoiceDate: Date = new Date;
  referenceNo: string = "";
  deliveryDate: Date = new Date;
  prId: string = "";
  prNo: string = "";
  poNo: string = "";
  poDate: Date = new Date;
  sourceOfFund: string = "";
  supplierId: string = "";
  supplierName: string = "";
  supplierAddress: string = "";
  purpose: string = "";
  supplyPropCust: string = "";
  receivedBy: string = "";
  receivedByPosition: string = "";
  cto: string = "";
  cao: string = "";
  cmo: string = "";
  it: string = "";
  
  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public router: Router,
    private route: ActivatedRoute,
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<InspectionAndAcceptanceReportActualComponent>,
    private httpRequest: HttpRequestService
  ) {
    dialogRefx.disableClose = true;
  }

  async ngOnInit(): Promise<void> {
    this.employees = this.authService.listEmployee;
    this.loadDepartment();
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
        this.httpRequest.getAcceptanceAndInspectionReportActualById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: AcceptanceAndInspectionReportModel) {
    this.iarId = data.id;
    this.referenceNo = data.referenceNo;
    this.deliveryDate = data.referenceDate;
    this.invoiceNo = data.invoiceNo;
    this.invoiceDate = data.invoiceDate;
    this.poNo = data.poNo;
    this.poDate = data.poDate;
    this.deptSelected.value = data.departmentId;
    this.deptSelected.text = data.departmentName;
    this.sourceOfFund = data.sourceOfFund;
    this.supplierId = data.supplierId;
    this.supplierName = data.supplierName;
    this.supplierAddress = data.supplierAddress;
    this.purpose = data.purpose;
    this.supplyPropCust = data.supplyPropCust;
    this.receivedBy = data.receivedBy;
    this.receivedByPosition = data.receivedByPosition;
    this.cto = data.cto;
    this.cao = data.cao;
    this.cmo = data.cmo;
    this.it = data.it;
    if (data.poId) {
      this.httpRequest.getPurchaseOrderById(data.poId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.selectedPo = result.data;

          this.selectedPo.items.forEach(async item => {
            var iarItem = data.items.find((itm) => itm.poItemId == item.id);
            iarItem.balance = +item.drActual[item.drActual.length-1]?.balance + iarItem.receivedQuantity || item.quantity;
          });
        }
      });
    }
    this.dataSource = data.items;

    this.btnSaveText = "Update"
  }

  loadDepartment() {
    this.departmentSelection = this.authService.listDepartment;

    var deptx: Department = this.departmentSelection.find(d => d.id == this.authService.getTypeId());
    this.deptSelected = {value: deptx.id, text: deptx.name};
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getAcceptanceAndInspectionReportActualTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.referenceNo = result.data[0].transactionNo;
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }

  deptSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  selectPO() {
    const dialogRef = this.dialog.open(ActualPoSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedPo = result.purchaseOrder;
        this.prId = this.selectedPo.prId,
        this.prNo = this.selectedPo.prNo,
        this.poNo = this.selectedPo.transactionNo;
        this.poDate = this.selectedPo.transactionDate;
        this.supplierId = this.selectedPo.supplierId;
        this.supplierName = this.selectedPo.supplierName;
        this.supplierAddress = this.selectedPo.supplierAddress;
        this.dataSource = [];
        this.selectedPo.items.forEach(async item => {
          await this.getItemType(item.itemId).then((_item: Item) => {
            var itm = new AcceptanceAndInspectionReportItemsModel(
              "",                 //id,
              item.id,            //poItemId,
              _item.typeId,       //groupId,
              _item.typedesc,     //groupName,
              item.itemId,        //itemId,
              item.description,   //description,
              item.specification, //specification,
              item.uom,           //uom,
              item.quantity,      //quantity,
              item.cost,          //price,
              0,                  //receivedQuantity,
              "",                 //brand,
              "",                 //brandId,
              null,               //expirationDate,
              "",                 //lotNo,
              "",                 //remarks,
              "",                 //serialNo,
              "",                 //model,
              [],                 //subItems
              item.drActual[item.drActual.length-1]?.balance || item.quantity, //balance
            )
            this.dataSource.push(itm);
            this.refreshTable();
          });
        });

        this.httpRequest.getPurchaseRequestById(this.prId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.deptSelected = {value: result.data.departmentId, text: result.data.departmentName}
            this.purpose = result.data.rationale;
            this.sourceOfFund = result.data.sourceOfFund;
          }
        });
      }
    });
  }

  getItemType(itemId: string): Promise<Item> {
    return new Promise((res, rej) => {
      this.httpRequest.getItemById(itemId).subscribe((result) => {
        if (result.statusCode == 200) {
          res(result.data);
        } else {
          rej("error");
        }
      });
    });
  }

  recQuantityChanged(qty: any, data: AcceptanceAndInspectionReportItemsModel) {
    if (+qty.target.value > +data.balance) {
      this.notifService.showNotification(NotificationType.error, "Received Quantity must not be greater than Balance Quantity.");
      data.receivedQuantity = +data.balance;
    }
  }

  async showItemEntry(item: AcceptanceAndInspectionReportItemsModel) {
    const dialogRef = this.dialog.open(ItemSetupDialogComponent, {
      data: {
        itemCategory: "Non-Generic",
        itemType: item.groupId,
        itemUom: item.uom,
        itemDescription: item.description,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          item.brand = result.selectedItem.description;
          item.brandId = result.selectedItem.id;
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item selected.");
        }
      }
    });
  }
  
  async showListItem(item: AcceptanceAndInspectionReportItemsModel) {
    await this.httpRequest.getItemById(item.itemId).subscribe((result) => {
      if (result.statusCode == 200) {
        var typeId: string = "";
        typeId = result.data.typeId;

        const dialogRef = this.dialog.open(ListItemDialogComponent, {
          data: {
            itemCategory: "Non-Generic",
            currentItemId: item.brandId,
            itemType: typeId
          },
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (result.selectedItem) {
              item.brand = result.selectedItem.description;
              item.brandId = result.selectedItem.id;
            }
            else if (result.isAddItem) {
              this.showItemEntry(item);
            } else {
              this.notifService.showNotification(NotificationType.error, "No Item selected.");
            }
          }
        });
      }
    });
  }

  addItem() {
    const dialogRef = this.dialog.open(AddItemDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.item) {
        this.dataSource.push(result.item);
        this.refreshTable();
      }
    });
  }

  editItem(index: number) {
    var selectedItemx: AcceptanceAndInspectionReportItemsModel;
    selectedItemx = this.dataSource[index];
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      data: {
        selectedItem: selectedItemx,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.item) {
        this.dataSource.splice(index, 1, result.item);
        this.refreshTable();
      }
    });
  }

  removeItem(index: number) {
    this.dataSource.splice(index, 1);
    this.refreshTable();
  }

  refreshTable() {
    let cloned = this.dataSource.slice();
    this.dataSource = cloned;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";
    
    // if (this.referenceNo == "") {
    //   msg = "Please input Reference No.";
    // }
    // if (this.invoiceNo == "") {
    //   msg = "Please input Invoice No.";
    // }
    // if (this.poNo == "") {
    //   msg = "Please input PO No.";
    // }
    if (this.deliveryDate == null) {
      msg = "Please input valid delivery date.";
    }
    if (this.deptSelected.value == "") {
      msg = "Please select Department.";
    }
    if (this.sourceOfFund == "") {
      msg = "Please select Source of Fund.";
    }
    if (this.supplierName == "") {
      msg = "Please input Supplier Name.";
    }
    if (this.supplierAddress == "") {
      msg = "Please input Supplier Address.";
    }
    if (this.dataSource.length == 0) {
      msg = "Please add Item/s.";
    }
    if (this.supplyPropCust == "" ||
      this.receivedBy == "" ||
      this.receivedByPosition == "" ||
      this.cto == "" ||
      this.cao == "" ||
      this.cmo == "") {
      msg = "Please select signatory.";
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
    if (this.isLoading) return;
    this.isLoading = true;
    var isDataValid = this.isEntryValid();
    
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      this.isLoading = false;
      return;
    }
    var data = new AcceptanceAndInspectionReportModel(
      this.iarId,
      this.referenceNo,
      this.deliveryDate,
      this.invoiceNo,
      this.invoiceDate,
      this.prId,
      this.prNo,
      this.selectedPo?.id || "",
      this.poNo,
      this.poDate,
      this.deptSelected?.value || "",
      this.deptSelected?.text || "",
      this.sourceOfFund,
      this.supplierId,
      this.supplierName,
      this.supplierAddress,
      this.purpose,
      this.supplyPropCust,
      this.receivedBy,
      this.receivedByPosition,
      this.cto,
      this.cao,
      this.cmo,
      this.it,
      this.dataSource
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveAcceptanceAndInspectionReportActual(data).subscribe((result) => {
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
      this.httpRequest.updateAcceptanceAndInspectionReportActual(this.iarId, data).subscribe((result) => {
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
    this.iarId = "";
    this.invoiceNo = "";
    this.invoiceDate = new Date;
    this.referenceNo = "";
    this.deliveryDate = new Date;
    this.poDate = new Date;
    this.prId = "";
    this.prNo = "";
    this.poNo = "";
    this.sourceOfFund = "";
    this.supplierName = "";
    this.supplierAddress = "";
    this.deptSelected = {value: "", text: ""}
    this.purpose = "";
    this.selectedPo = null;
    this.dataSource = [];
    this.btnSaveText = "Save";
    this.isLoading = false;
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/inspection-and-acceptance-report-actual");
    }
  }

  gotoList() {
    this.router.navigate(["/inspection-and-acceptance-report-actual-list"]);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'M/d/yyyy') || "";
  }

  onItemChange(event: any, item: AcceptanceAndInspectionReportItemsModel) {
    item.brand = event.option.value.description;
    item.brandId = event.option.value.id;
  }

  itemDisplayFn(item: Item) {
    return item ? item.description || item.toString() : '';
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
          case "supplyPropCust":
            this.supplyPropCust = result.employee.Fullname;
            break;
          case "receivedBy":
            this.receivedBy = result.employee.Fullname;
            this.receivedByPosition = result.employee.Position;
            break;
          case "cto":
            this.cto = result.employee.Fullname;
            break;
          case "cao":
            this.cao = result.employee.Fullname;
            break;
          case "cmo":
            this.cmo = result.employee.Fullname;
            break;
          case "it":
            this.it = result.employee.Fullname;
            break;
        }
      }
    });
  }
}
