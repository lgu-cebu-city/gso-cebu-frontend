import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { InventoryMedicineModel } from 'src/app/data-model/inventory-medicine-model';
import { PropertyTransferItemModel } from 'src/app/data-model/property-transfer-item-model';
import { PropertyTransfer } from 'src/app/data-model/property-transfer-model';
import { RequisitionAndIssuanceItemModel } from 'src/app/data-model/requisition-and-issuance-item-model';
import { RequisitionAndIssuanceModel } from 'src/app/data-model/requisition-and-issuance-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { TransferSelectionDialogComponent } from './transfer-selection-dialog/transfer-selection-dialog.component';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { Department } from 'src/app/data-model/department';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';
import { TwItemSelectionDialogComponent } from './tw-item-selection-dialog/tw-item-selection-dialog.component';
import { Item } from 'src/app/data-model/item';

export interface DialogData {
  selectedData: PropertyTransfer;
}

@Component({
  selector: 'app-transfer-withdrawal',
  templateUrl: './transfer-withdrawal.component.html',
  styleUrls: ['./transfer-withdrawal.component.css']
})
export class TransferWithdrawalComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  isLoading: boolean = false;
  itemDataSource = new MatTableDataSource<PropertyTransferItemModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  itemDisplayedColumns: string[] = ['itemCode', 'unit', 'description', 'quantity', 'action'];
  datepipe: DatePipe = new DatePipe('en-US');
  twId: string = "";
  employees: iEmp[];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  departmentSelection: Department[] = [];
  btnSaveText: string = "Save";
  
  transactionNo: string = "";
  transactionDate: Date = new Date;
  accountablePersonFromId: string = "";
  accountablePersonFromName: string = "";
  accountablePersonFromDesignation: string = "";
  accountablePersonToId: string = "";
  accountablePersonToName: string = "";
  accountablePersonToDesignation: string = "";
  approvePersonId: string = "";
  approvePersonName: string = "";
  approvePersonDesignation: string = "";
  releasePersonId: string = "";
  releasePersonName: string = "";
  releasePersonDesignation: string = "";
  remarks: string = "";
  
  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<TransferWithdrawalComponent>,
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
        this.httpRequest.getPropertyTransferById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: PropertyTransfer) {
    this.twId = data.id;
    this.transactionNo = data.transactionNo;
    this.transactionDate = data.transactionDate;
    this.accountablePersonFromId = data.accountablePersonIdFrom;
    this.accountablePersonFromName = data.accountablePersonNameFrom;
    this.accountablePersonFromDesignation = data.accountablePersonDesignationFrom;
    this.accountablePersonToId = data.accountablePersonIdTo;
    this.accountablePersonToName = data.accountablePersonNameTo;
    this.accountablePersonToDesignation = data.accountablePersonDesignationTo;
    this.approvePersonId = data.approvePersonId;
    this.approvePersonName = data.approvePersonName;
    this.approvePersonDesignation = data.approvePersonDesignation;
    this.releasePersonId = data.releasePersonId;
    this.releasePersonName = data.releasePersonName;
    this.releasePersonDesignation = data.releasePersonDesignation;
    this.remarks = data.remarks;

    data.items.forEach((item) => {
      this.itemDataSource.data.push(item);
      this.refreshTable();
    });
    this.btnSaveText = "Update";
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getPropertyTransferTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.transactionNo = result.data[0].transactionNo;
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }

  loadDepartment() {
    this.departmentSelection = this.authService.listDepartment;

    var deptx: Department = this.departmentSelection.find(d => d.id == this.authService.getTypeId());
    var deptHead: iEmp = this.employees.find(emp => emp.id == deptx.emp_head);
    var empLogin: iEmp = this.employees.find(emp => emp.id == this.authService.getEmpId());

    if (deptHead) {
      this.accountablePersonFromId = deptHead.id;
      this.accountablePersonFromName = deptHead.Fullname;
      this.accountablePersonFromDesignation = deptHead.Position;
      var empDept = this.departmentSelection.find(dept => dept.prefix == deptHead.departmentId);
      if (empDept) {
        this.deptSelected = { text: empDept.description, value: empDept.id };
      }
      this.approvePersonId = deptHead.id;
      this.approvePersonName = deptHead.Fullname;
      this.approvePersonDesignation = deptHead.Position;
    }

    if (empLogin) {
      this.accountablePersonToId = empLogin.id;
      this.accountablePersonToName = empLogin.Fullname;
      this.accountablePersonToDesignation = empLogin.Position;
      this.releasePersonId = empLogin.id;
      this.releasePersonName = empLogin.Fullname;
      this.releasePersonDesignation = empLogin.Position;
    }
  }

  quantityChanged(qty: any, data: PropertyTransferItemModel) {
    if (+qty.target.value > +data.requestedQty) {
      this.notifService.showNotification(NotificationType.error, "Quantity must not be greater than Inventory Quantity.");
      data.issuedQty = +data.requestedQty;
    }
  }

  addItem() {
    const dialogRef = this.dialog.open(TwItemSelectionDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.selectedItem) {
          var item: Item = result.selectedItem;
          var ptItem: PropertyTransferItemModel = new PropertyTransferItemModel(
            "",
            item.id,
            item.code,
            "",
            item.uom,
            item.description,
            item.quantity,
            "",
            item.quantity,
            "",
            item.id,
            item.typeId,
            item.price,
            "",
            []
          );

          this.itemDataSource.data.push(ptItem);
          this.refreshTable();
        } else {
          this.notifService.showNotification(NotificationType.error, "No Item selected.");
        }
      }
    });
  }

  removeItem(index: number) {
    this.itemDataSource.data.splice(index, 1);
    this.refreshTable();
  }

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
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

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.accountablePersonFromName == "") {
      msg = "Please select Accountable Person.";
    }
    if (this.accountablePersonToName == "") {
      msg = "Please select Assigned Person.";
    }
    if (this.approvePersonName == "" || this.releasePersonName == "") {
      msg = "Please select Signatory.";
    }
    if (this.itemDataSource.data.length == 0) {
      msg = "Please add item/s.";
    }

    return {result: msg == "", message: msg};
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

    this.itemDataSource.data.forEach(itm => {
      itm.requestedQty = itm.issuedQty;
    });

    var data = new PropertyTransfer(
      "",
      this.transactionNo,
      this.transactionDate,
      this.deptSelected.value,
      this.deptSelected.text,
      this.accountablePersonFromId,
      this.accountablePersonFromName,
      this.accountablePersonFromDesignation,
      this.accountablePersonToId,
      this.accountablePersonToName,
      this.accountablePersonToDesignation,
      this.approvePersonId,
      this.approvePersonName,
      this.approvePersonDesignation,
      this.releasePersonId,
      this.releasePersonName,
      this.releasePersonDesignation,
      this.remarks,
      this.itemDataSource.data
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.savePropertyTransfer(data).subscribe((result) => {
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
      this.httpRequest.updatePropertyTransfer(this.twId, data).subscribe((result) => {
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
    this.transactionNo = "";
    this.transactionDate = new Date;
    this.accountablePersonFromId = "";
    this.accountablePersonFromName = "";
    this.accountablePersonFromDesignation = "";
    this.accountablePersonToId = "";
    this.accountablePersonToName = "";
    this.accountablePersonToDesignation = "";
    this.approvePersonId = "";
    this.approvePersonName = "";
    this.approvePersonDesignation = "";
    this.releasePersonId = "";
    this.releasePersonName = "";
    this.releasePersonDesignation = "";
    this.remarks = "";
    this.deptSelected = { text: "", value: "" };
    this.itemDataSource = new MatTableDataSource<PropertyTransferItemModel>([]);
    this.twId = "";
    this.btnSaveText = "Save";
    this.isLoading = false;
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/transfer-withdrawal");
    }
  }

  gotoList() {
    this.router.navigate(["/transfer-withdrawal-list"]);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
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
          case "accountablePersonFrom":
            this.accountablePersonFromId = result.employee.id;
            this.accountablePersonFromName = result.employee.Fullname;
            this.accountablePersonFromDesignation = result.employee.Position;
            
            var empDept = this.departmentSelection.find(dept => dept.prefix == result.employee.departmentId);
            if (empDept) {
              this.deptSelected = { text: empDept.description, value: empDept.id };
            }
            break;
          case "accountablePersonTo":
            this.accountablePersonToId = result.employee.id;
            this.accountablePersonToName = result.employee.Fullname;
            this.accountablePersonToDesignation = result.employee.Position;
            break;
          case "approvePerson":
            this.approvePersonId = result.employee.id;
            this.approvePersonName = result.employee.Fullname;
            this.approvePersonDesignation = result.employee.Position;
            break;
          case "releasePerson":
            this.releasePersonId = result.employee.id;
            this.releasePersonName = result.employee.Fullname;
            this.releasePersonDesignation = result.employee.Position;
            break;
        }
      }
    });
  }
}
