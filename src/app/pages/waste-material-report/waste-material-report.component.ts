import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Department } from 'src/app/data-model/department';
import { WasteMaterialReportItemModel } from 'src/app/data-model/waste-material-report-item-model';
import { WasteMaterialReportModel } from 'src/app/data-model/waste-material-report-model';
import { WasteMaterialReportInspectionCertificateModel } from 'src/app/data-model/waste-material-report-inspection-certificate-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { WmrItemDetailDialogComponent } from './wmr-item-detail-dialog/wmr-item-detail-dialog.component';
import { CertificateInspectionEntryDialogComponent } from './certificate-inspection-entry-dialog/certificate-inspection-entry-dialog.component';
import { DatePipe } from '@angular/common';
import { PoriSelectionDialogComponent } from './pori-selection-dialog/pori-selection-dialog.component';
import { PostRepairInspectionModel } from 'src/app/data-model/post-repair-inspection-model';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  selectedData: WasteMaterialReportModel;
  selectedItem: WasteMaterialReportItemModel;
  selectedCertificate: WasteMaterialReportInspectionCertificateModel;
  department: string;
  currentItemId: string;
}

@Component({
  selector: 'app-waste-material-report',
  templateUrl: './waste-material-report.component.html',
  styleUrls: ['./waste-material-report.component.css']
})
export class WasteMaterialReportComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  currUser: string = sessionStorage.getItem("role");
  datepipe: DatePipe = new DatePipe('en-US');
  departmentSelection: Department[] = [];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  itemDataSource = new MatTableDataSource<WasteMaterialReportItemModel>([]);
  inspCertDataSource = new MatTableDataSource<WasteMaterialReportInspectionCertificateModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  itemDisplayedColumns: string[] = ['itemNo', 'quantity', 'uom', 'description', 'orNo', 'orDate', 'amount', 'action'];
  inspCertDisplayedColumns: string[] = ['quantity', 'description', 'transferTo', 'action'];
  wmrId: string = "";
  transNo: string = "";
  transDate: Date = new Date;
  placeOfStorage: string = "";
  fund: string = "";
  remarks: string = "";
  inspOfficerId: string = "";
  inspOfficerName: string = "";
  witnessId: string = "";
  witnessName: string = "";
  btnSaveText: string = "Save";
  employees: iEmp[];

  formControlDepartment = new FormControl('');
  filteredDepartment: Observable<Department[]>;

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private httpRequest: HttpRequestService,
    @Optional() private dialogRefx: MatDialogRef<WasteMaterialReportComponent>
  ) { }

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
        this.httpRequest.getWasteMaterialReportById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: WasteMaterialReportModel) {
    this.wmrId = data.id;
    this.transNo = data.transactionNo;
    this.transDate = data.transactionDate;
    this.deptSelected = { value: data.departmentId, text: data.departmentName };
    this.placeOfStorage = data.placeOfStorage;
    this.remarks = data.remarks;
    this.inspOfficerId = data.inspOfficerId;
    this.inspOfficerName = data.inspOfficerName;
    this.witnessId = data.witnessId;
    this.witnessName = data.witnessName;
    this.itemDataSource.data = data.items;
    this.refreshTable();
    this.inspCertDataSource.data = data.inspectionCertificate;
    this.refreshTableInspCertificate();
    this.btnSaveText = "Update";
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getWasteMaterialReportTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.transNo = result.data[0].transactionNo;
          return res(true);
        } else {
          return rej(false);
        }
      });
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

  addItem() {
    if (!this.deptSelected.value) {
      this.notifService.showNotification(NotificationType.error, "Please select department!");
      return;
    }
    const dialogRef = this.dialog.open(PoriSelectionDialogComponent, {
      data: {
        department: this.deptSelected.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.pri) {
        var pri: PostRepairInspectionModel = result.pri;
        var items: WasteMaterialReportItemModel[] = [];
        pri.items.forEach((itm) => {{
          var retItem = new WasteMaterialReportItemModel(
            "",
            "",
            itm.quantity,
            itm.itemId,
            itm.description,
            itm.uom,
            pri.id,
            pri.transactionNo,
            "PRI",
            "",
            null,
            itm.cost,
            itm.dateAcquired,
          );
          items.push(retItem);
        }});
        this.itemDataSource = new MatTableDataSource<WasteMaterialReportItemModel>(items);
        this.refreshTable();
      }
    });
  }

  editItem(index: number) {
    var selectedItemx: WasteMaterialReportItemModel;
    selectedItemx = this.itemDataSource.data[index];
    const dialogRef = this.dialog.open(WmrItemDetailDialogComponent, {
      data: {
        department: this.deptSelected.value,
        selectedItem: selectedItemx,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemDataSource.data.splice(index, 1, result.retItem);
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
          case "InspectionOfficer":
            this.inspOfficerId = result.employee.id;
            this.inspOfficerName = result.employee.Fullname;
            break;
          case "Witness":
            this.witnessId = result.employee.id;
            this.witnessName = result.employee.Fullname;
            break;
          default:
            break
        }
      }
    });
  }

  addInspCertificate() {
    const dialogRef = this.dialog.open(CertificateInspectionEntryDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.retItem) {
        result.retItem.itemNo = this.inspCertDataSource.data.length + 1;
        this.inspCertDataSource.data.push(result.retItem);
        this.refreshTableInspCertificate();
      }
    });
  }

  editInspCertificate(index: number) {
    var selectedItemx: WasteMaterialReportInspectionCertificateModel;
    selectedItemx = this.inspCertDataSource.data[index];
    const dialogRef = this.dialog.open(CertificateInspectionEntryDialogComponent, {
      data: {
        selectedCertificate: selectedItemx,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inspCertDataSource.data.splice(index, 1, result.retItem);
        this.refreshTableInspCertificate();
      }
    });
  }

  removeInspCertificate(index: number) {
    this.inspCertDataSource.data.splice(index, 1);
    this.refreshTableInspCertificate();
  }

  refreshTableInspCertificate() {
    let cloned = this.inspCertDataSource.data.slice();
    this.inspCertDataSource.data = cloned;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.placeOfStorage == "") {
      msg = "Please input action taken!";
    }
    if (this.itemDataSource.data.length == 0) {
      msg = "Please add Item!";
    }
    if (this.deptSelected.value == "") {
      msg = "Please select department!";
    }
    if (this.deptSelected.text == "") {
      msg = "Please select department!";
    }
    if (this.placeOfStorage == "") {
      msg = "Please select place of storage!";
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
    if (!this.isEntryValid().result) {
      this.notifService.showNotification(NotificationType.error, this.isEntryValid().message);
      return;
    }
    var data = new WasteMaterialReportModel(
      "",
      this.transNo,
      this.transDate,
      this.deptSelected.value,
      this.deptSelected.text,
      this.placeOfStorage,
      this.inspOfficerId,
      this.inspOfficerName,
      this.witnessId,
      this.witnessName,
      this.fund,
      this.remarks,
      this.itemDataSource.data,
      this.inspCertDataSource.data,
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveWasteMaterialReport(data).subscribe((result) => {
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
      this.httpRequest.updateWasteMaterialReport(this.wmrId, data).subscribe((result) => {
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
    this.wmrId = "";
    this.transNo = "";
    this.transDate = new Date;
    this.placeOfStorage = "";
    this.inspOfficerId = "";
    this.inspOfficerName = "";
    this.witnessId = "";
    this.witnessName = "";
    this.remarks = "";
    this.deptSelected = {value: "", text: ""};
    this.itemDataSource = new MatTableDataSource<WasteMaterialReportItemModel>([]);
    this.inspCertDataSource = new MatTableDataSource<WasteMaterialReportInspectionCertificateModel>([]);
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/waste-material-report");
    }
  }

  gotoList() {
    this.router.navigate(["/waste-material-report-list"]);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
