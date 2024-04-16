import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AcceptanceAndInspectionReportModel } from 'src/app/data-model/acceptance-and-inspection-report-model';
import { InventoryCustodianSlipItemsModel } from 'src/app/data-model/inventory-custodian-slip-items-model';
import { InventoryCustodianSlipModel } from 'src/app/data-model/inventory-custodian-slip-model';
import { Department } from 'src/app/data-model/department';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { IcsAddItemDialogComponent } from './ics-add-item-dialog/ics-add-item-dialog.component';
import { IarListSelectionIcsComponent } from './iar-list-selection-ics/iar-list-selection-ics.component';
import { map, Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  selectedData: InventoryCustodianSlipModel;
  itemCategory: string,
  itemType: string,
  currentItemId: string,
  selectedItem: InventoryCustodianSlipItemsModel;
}

@Component({
  selector: 'app-inventory-custodian-slip',
  templateUrl: './inventory-custodian-slip.component.html',
  styleUrls: ['./inventory-custodian-slip.component.css']
})
export class InventoryCustodianSlipComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  currUser: string = sessionStorage.getItem("role");
  departmentSelection: Department[] = [];
  datepipe: DatePipe = new DatePipe('en-US');
  displayedColumns: string[] = ['quantity', 'uom', 'price', 'totalCost', 'description', 'propertyNo', 'serialNo', 'remarks'];
  displayedColumnsWithAction: string[] = ['quantity', 'uom', 'price', 'totalCost', 'description', 'propertyNo', 'serialNo', 'remarks', 'action'];
  dataSource: InventoryCustodianSlipItemsModel[] = [];
  selectedIar: AcceptanceAndInspectionReportModel;
  btnSaveText: string = "Save";
  employees: iEmp[];

  formControlDepartment = new FormControl('');
  filteredDepartment: Observable<Department[]>;

  icsId: string = "";
  icsNo: string = "";
  icsDate: Date = new Date;
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  fundCluster: string = "";
  accountType: string = "";
  prNo: string = "";
  poNo: string = "";
  location: string = "";
  supplier: string = "";
  deliveryDate: Date = new Date;
  remarks: string = "";
  receivedFromId: string = "";
  receivedFromName: string = "";
  receivedById: string = "";
  receivedByName: string = "";

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private httpRequest: HttpRequestService,
    @Optional() private dialogRefx: MatDialogRef<InventoryCustodianSlipComponent>
  ) { }

  async ngOnInit(): Promise<void> {
    this.employees = this.authService.listEmployee;
    this.loadDepartment();
    this.initSignatory();
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
        this.httpRequest.getInventoryCustodianSlipById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: InventoryCustodianSlipModel) {
    this.icsId = data.id;
    this.icsNo = data.icsNo;
    this.icsDate = data.icsDate;
    this.deptSelected = { value: data.departmentId, text: data.departmentName };
    this.fundCluster = data.fundCluster;
    this.accountType = data.accountType;
    this.prNo = data.prNo;
    this.poNo = data.poNo;
    this.location = data.location;
    this.supplier = data.supplierName;
    this.deliveryDate = data.deliveryDate;
    this.remarks = data.remarks;
    this.receivedFromId = data.receivedFromId;
    this.receivedFromName = data.receivedFromName;
    this.receivedById = data.receivedById;
    this.receivedByName = data.receivedByName;
    this.dataSource = data.items;
    this.btnSaveText = "Update";
  }

  initSignatory() {
    var _xdept = this.authService.listDepartment.find(d => d.id == environment.gsoDeptId);
    if (_xdept) {
      var _xEmp = this.authService.listEmployee.find(e => e.id == _xdept.emp_head);
      this.receivedFromId = _xEmp?.id || "";
      this.receivedFromName = _xEmp?.Fullname || "";
    }
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getInventoryCustodianSlipTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.icsNo = result.data[0].transactionNo;
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }

  async getPropertyNo(_prefix: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.httpRequest.getInventoryCustodianSlipPropertyNo(_prefix).subscribe((result) => {
        if (result.statusCode == 200) {
          resolve(result.data[0].propertyNo);
        } else {
          reject(null);
        }
      })
    });
  }

  loadDepartment() {
    this.departmentSelection = this.authService.listDepartment;

    this.filteredDepartment = this.formControlDepartment.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDepartment(value || '')),
    );

    var deptx: Department = this.departmentSelection.find(d => d.id == this.authService.getTypeId());
    this.deptSelected = {value: deptx.id, text: deptx.name};
  }

  private _filterDepartment(value: string): Department[] {
    const filterValue = value.toLowerCase();
    return this.departmentSelection.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  departmentSelectionChanged(event: any) {
    this.deptSelected = {
      value: event.option.value,
      text: this.departmentSelection.find(dept => dept.id == event.option.value).name
    };
  }

  clearDepartmentFilter() {
    this.deptSelected = {
      value: "",
      text: ""
    };
  }

  deptSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  selectIAR() {
    const dialogRef = this.dialog.open(IarListSelectionIcsComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        var itemCount = 0;
        this.dataSource = [];
        this.selectedIar = result.iar;
        
        if (this.selectedIar.items.length == 0) {
          this.notifService.showNotification(NotificationType.error, "No item selected.");
          return;
        }

        this.deptSelected = { value: this.selectedIar.departmentId, text: this.selectedIar.departmentName };
        this.poNo = this.selectedIar.poNo;
        this.supplier = this.selectedIar.supplierName;
        this.fundCluster = this.selectedIar.sourceOfFund;
        this.accountType = this.selectedIar.items[0].groupName;
        var prevItemGrp: string = "";
        for (const _item of this.selectedIar.items) {
          if (prevItemGrp != _item.groupId) {
            prevItemGrp = _item.groupId;
            itemCount = 0;
          }
          await this.getPropertyNo(_item.groupId).then(propNo => {
            for (var i = 0; i < _item.quantity; i++) {
              var item = new InventoryCustodianSlipItemsModel(
                "",
                _item.poItemId,
                _item.groupId,
                _item.groupName,
                _item.itemId,
                propNo.split('-')[0] + '-' + String((+propNo.split('-')[1]) + itemCount).padStart(6, '0'),
                _item.description,
                _item.uom,
                1,
                _item.price,
                new Date,
                _item.receivedQuantity,
                _item.brand,
                _item.brandId,
                _item.expirationDate,
                _item.lotNo,
                _item.remarks,
                _item.serialNo,
                _item.model,
                this.selectedIar.id,
                _item.id,
                _item.subItems
              )
              this.dataSource.push(item);
              this.refreshTable();
              
              itemCount += 1;
            }
          });
        }
      }
    });
  }

  addItem() {
    const dialogRef = this.dialog.open(IcsAddItemDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.item) {
        this.dataSource.push(result.item);
        this.refreshTable();
      }
    });
  }

  editItem(index: number) {
    var selectedItemx: InventoryCustodianSlipItemsModel;
    selectedItemx = this.dataSource[index];
    const dialogRef = this.dialog.open(IcsAddItemDialogComponent, {
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

  selectEmployee() {
    const dialogRef = this.dialog.open(EmployeeSelectionComponent, {
      data: {
        employees: this.employees,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.employee) {
        this.receivedById = result.employee.id;
        this.receivedByName = result.employee.Fullname;
      }
    });
  }

  refreshTable() {
    let cloned = this.dataSource.slice();
    this.dataSource = cloned;
  }

  isDataValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.icsNo == "") {
      msg = "Please input ICS No!";
    }
    if (this.deptSelected.value == "") {
      msg = "Please select department!";
    }
    if (this.deptSelected.text == "") {
      msg = "Please select department!";
    }
    if (this.fundCluster == "") {
      msg = "Please input fund cluster";
    }
    if (this.accountType == "") {
      msg = "Please input account type!";
    }
    if (this.prNo == "") {
      msg = "Please input PR No!";
    }
    if (this.poNo == "") {
      msg = "Please input PO No!";
    }
    if (this.supplier == "") {
      msg = "Please input Supplier!";
    }
    if (this.receivedByName == "") {
      msg = "Please input received by person!";
    }
    if (this.receivedFromName == "") {
      msg = "Please input received from person!";
    }
    if (!this.dataSource.length) {
      msg = "Please add item!";
    } else {
      this.dataSource.forEach(item => {
        var regExp = /[a-zA-Z]/g;
                    
        if(regExp.test(item.propertyNo)){
          msg = "Only numbers are allowed in property number.";
        }
      });
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
    if (!this.isDataValid().result) {
      this.notifService.showNotification(NotificationType.error, this.isDataValid().message);
      return;
    }
    var data = new InventoryCustodianSlipModel(
      this.icsId,
      this.icsNo,
      this.icsDate,
      this.deptSelected.value,
      this.deptSelected.text,
      this.fundCluster,
      this.accountType,
      this.prNo,
      this.poNo,
      this.location,
      this.supplier,
      this.deliveryDate,
      this.remarks,
      this.receivedFromId,
      this.receivedFromName,
      this.receivedById,
      this.receivedByName,
      this.dataSource
    )

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveInventoryCustodianSlip(data).subscribe((result) => {
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
      this.httpRequest.updateInventoryCustodianSlip(this.icsId, data).subscribe((result) => {
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
    this.icsId = "";
    this.icsNo = "";
    this.icsDate = new Date;
    this.deptSelected = {value: "", text: ""};
    this.fundCluster = "";
    this.accountType = "";
    this.prNo = "";
    this.poNo = "";
    this.location = "";
    this.supplier = "";
    this.deliveryDate = new Date;
    this.remarks = "";
    this.receivedById = "";
    this.receivedByName = "";
    this.dataSource = [];
    this.selectedIar = null;
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/inventory-custodian-slip");
    }
  
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  gotoList() {
    this.router.navigate(["/inventory-custodian-slip-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
