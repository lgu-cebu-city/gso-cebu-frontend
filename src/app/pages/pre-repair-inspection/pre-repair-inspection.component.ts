import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PreRepairInspectionItemsModel } from 'src/app/data-model/pre-repair-inspection-items-model';
import { PreRepairInspectionModel } from 'src/app/data-model/pre-repair-inspection-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { PreRepairItemDetailsDialogComponent } from './pre-repair-item-details-dialog/pre-repair-item-details-dialog.component';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  selectedData: PreRepairInspectionModel;
}

@Component({
  selector: 'app-pre-repair-inspection',
  templateUrl: './pre-repair-inspection.component.html',
  styleUrls: ['./pre-repair-inspection.component.css']
})
export class PreRepairInspectionComponent implements OnInit {
  currUser: string = sessionStorage.getItem("role");
  envFirstLoad = environment.firstLoad;
  itemDataSource = new MatTableDataSource<PreRepairInspectionItemsModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  itemDisplayedColumns: string[] = ['description', 'quantity', 'unitMeasure', 'remarks', 'action'];
  datepipe: DatePipe = new DatePipe('en-US');

  priId: string = "";
  transactionNo: string = "";
  transactionDate: Date = new Date;
  vehicleName: string = "";
  vehicleType: string = "";
  plateNo: string = "";
  brandModel: string = "";
  engineNo: string = "";
  chassisNo: string = "";
  acquisationDate: Date = null;
  acquisationCost: number = 0;
  lastRepairDate: Date = null;
  lastRepairNature: string = "";
  defectComplaints: string = "";
  workScope: string = "";
  remarks: string = "";
  requestedById: string = "";
  requestedByName: string = "";
  inspectedBy1Id: string = "";
  inspectedBy1Name: string = "";
  inspectedBy2Id: string = "";
  inspectedBy2Name: string = "";
  notedById: string = "";
  notedByName: string = "";
  btnSaveText: string = "Save";
  employees: iEmp[];
  
  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private httpRequest: HttpRequestService,
    @Optional() private dialogRefx: MatDialogRef<PreRepairInspectionComponent>
  ) { }

  async ngOnInit(): Promise<void> {
    this.employees = this.authService.listEmployee;
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
        this.httpRequest.getPreRepairInspectionById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: PreRepairInspectionModel) {
    this.priId = data.id;
    this.transactionNo = data.transactionNo;
    this.transactionDate = data.transactionDate;
    this.vehicleName = data.vehicleName;
    this.vehicleType = data.vehicleType;
    this.plateNo = data.plateNo;
    this.brandModel = data.brandModel;
    this.engineNo = data.engineNo;
    this.chassisNo = data.chassisNo;
    this.acquisationDate = data.acquisationDate;
    this.acquisationCost = data.acquisationCost;
    this.lastRepairDate = data.lastRepairDate;
    this.lastRepairNature = data.lastRepairNature;
    this.defectComplaints = data.defectComplaints;
    this.workScope = data.workScope;
    this.remarks = data.remarks;
    this.requestedById = data.requestedById;
    this.requestedByName = data.requestedByName;
    this.inspectedBy1Id = data.inspectedBy1Id;
    this.inspectedBy1Name = data.inspectedBy1Name;
    this.inspectedBy2Id = data.inspectedBy2Id;
    this.inspectedBy2Name = data.inspectedBy2Name;
    this.notedById = data.notedById;
    this.notedByName = data.notedByName;
    data.items.forEach((item) => {
      this.itemDataSource.data.push(item);
      this.refreshTable();
    });
    this.btnSaveText = "Update";
  }

  initSignatory() {
    var _xdept = this.authService.listDepartment.find(d => d.id == environment.gsoDeptId);
    if (_xdept) {
      var _xEmp = this.authService.listEmployee.find(e => e.id == _xdept.emp_head);
      this.notedById = _xEmp?.id || "";
      this.notedByName = _xEmp?.Fullname || "";
    }
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getPreRepairInspectionTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.transactionNo = result.data[0].transactionNo;
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }

  addItem() {
    const dialogRef = this.dialog.open(PreRepairItemDetailsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemDataSource.data.push(result);
        this.refreshTable();
      }
    });
  }

  editItem(index: number) {
    var selectedItemx: PreRepairInspectionItemsModel;
    selectedItemx = this.itemDataSource.data[index];
    const dialogRef = this.dialog.open(PreRepairItemDetailsDialogComponent, {
      data: {
        selectedItem: selectedItemx,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemDataSource.data.splice(index, 1, result);
        this.refreshTable();
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

  selectEmployee(sig: string) {
    const dialogRef = this.dialog.open(EmployeeSelectionComponent, {
      data: {
        employees: this.employees,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.employee) {
        switch (sig) {
          case "Requested":
            this.requestedById = result.employee.id;
            this.requestedByName = result.employee.Fullname;
            break;
          case "Inspected1":
            this.inspectedBy1Id = result.employee.id;
            this.inspectedBy1Name = result.employee.Fullname;
            break;
          case "Inspected2":
            this.inspectedBy2Id = result.employee.id;
            this.inspectedBy2Name = result.employee.Fullname;
            break;
          default:
            break
        }
      }
    });
  }

  isDataValid(): {result: boolean, message: string} {
    var msg = "";

    // if (this.parNo == "") {
    //   msg = "Please input PAR No!";
    // }
    // if (this.deptSelected.value == "") {
    //   msg = "Please select Department!";
    // }
    // if (this.fundCluster == "") {
    //   msg = "Please input fund cluster!";
    // }
    // if (this.accountType == "") {
    //   msg = "Please input account type!";
    // }
    // if (this.prNo == "") {
    //   msg = "Please input PR No!";
    // }
    // if (this.poNo == "") {
    //   msg = "Please input PO No!";
    // }
    // if (this.location == "") {
    //   msg = "Please input Location!";
    // }
    // if (this.supplier == "") {
    //   msg = "Please input Supplier!";
    // }
    // if (this.receivedByName == "") {
    //   msg = "Please input received by person!";
    // }
    // if (this.issuedByName == "") {
    //   msg = "Please input issued by person!";
    // }
    // if (!this.dataSource.length) {
    //   msg = "Please add item!";
    // } else {
    //   this.dataSource.forEach(item => {
    //     var regExp = /[a-zA-Z]/g;
                    
    //     if(regExp.test(item.propertyNo)){
    //       msg = "Only numbers are allowed in property number.";
    //     }
    //   });
    // }

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
    var data = new PreRepairInspectionModel(
      this.priId,
      this.transactionNo,
      this.transactionDate,
      this.vehicleName,
      this.vehicleType,
      this.plateNo,
      this.brandModel,
      this.engineNo,
      this.chassisNo,
      this.acquisationDate,
      this.acquisationCost,
      this.lastRepairDate,
      this.lastRepairNature,
      this.defectComplaints,
      this.workScope,
      this.remarks,
      this.requestedById,
      this.requestedByName,
      this.inspectedBy1Id,
      this.inspectedBy1Name,
      this.inspectedBy2Id,
      this.inspectedBy2Name,
      this.notedById,
      this.notedByName,
      this.itemDataSource.data
    )

    if (this.btnSaveText == "Save") {
      this.httpRequest.savePreRepairInspection(data).subscribe((result) => {
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
      this.httpRequest.updatePreRepairInspection(this.priId, data).subscribe((result) => {
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
    this.priId = "";
    this.transactionNo = "";
    this.transactionDate = new Date;
    this.vehicleName = "";
    this.vehicleType = "";
    this.plateNo = "";
    this.brandModel = "";
    this.engineNo = "";
    this.chassisNo = "";
    this.acquisationDate = null;
    this.acquisationCost = 0;
    this.lastRepairDate = null;
    this.lastRepairNature = "";
    this.defectComplaints = "";
    this.workScope = "";
    this.remarks = "";
    this.requestedById = "";
    this.requestedByName = "";
    this.inspectedBy1Id = "";
    this.inspectedBy1Name = "";
    this.inspectedBy2Id = "";
    this.inspectedBy2Name = "";
    this.notedById = "";
    this.notedByName = "";
    this.itemDataSource.data = [];
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/pre-repair-inspection");
    }
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  gotoList() {
    this.router.navigate(["/pre-repair-inspection-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

}
