import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Department } from 'src/app/data-model/department';
import { PostRepairInspectionItemsModel } from 'src/app/data-model/post-repair-inspection-items-model';
import { PostRepairInspectionModel } from 'src/app/data-model/post-repair-inspection-model';
import { PreRepairInspectionItemsModel } from 'src/app/data-model/pre-repair-inspection-items-model';
import { PreRepairInspectionModel } from 'src/app/data-model/pre-repair-inspection-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { PriSelectionDialogComponent } from './pri-selection-dialog/pri-selection-dialog.component';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  selectedData: PostRepairInspectionModel;
}

@Component({
  selector: 'app-post-repair-inspection',
  templateUrl: './post-repair-inspection.component.html',
  styleUrls: ['./post-repair-inspection.component.css']
})
export class PostRepairInspectionComponent implements OnInit {
  currUser: string = sessionStorage.getItem("role");
  envFirstLoad = environment.firstLoad;
  selectedPreRepair: PreRepairInspectionModel = new PreRepairInspectionModel;
  itemDataSource = new MatTableDataSource<PostRepairInspectionItemsModel>([]);
  numberFormat = Intl.NumberFormat('en-US', { style: "currency", currency: "Php" });
  itemDisplayedColumns: string[] = ['quantity', 'unitMeasure', 'description', 'unitCost', 'totalCost'];
  datepipe: DatePipe = new DatePipe('en-US');
  departmentSelection: Department[];
  sectionSelection: Department[];

  formControlDepartment = new FormControl('');
  filteredDepartment: Observable<Department[]>;

  priId: string = "";
  transactionNo: string = "";
  transactionDate: Date = new Date;
  vehicleName: string = "";
  vehicleType: string = "";
  plateNo: string = "";
  brandModel: string = "";
  engineNo: string = "";
  chassisNo: string = "";
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  divisionId: string = "";
  divisionName: string = "";
  jobDescription: string = "";
  remarks: string = "";
  signatory1Id: string = "";
  signatory1Name: string = "";
  signatory2Id: string = "";
  signatory2Name: string = "";
  acceptedById: string = "";
  acceptedByName: string = "";
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
    @Optional() private dialogRefx: MatDialogRef<PostRepairInspectionComponent>
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
        this.httpRequest.getPostRepairInspectionById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: PostRepairInspectionModel) {
    this.priId = data.id;
    this.transactionNo = data.transactionNo;
    this.transactionDate = data.transactionDate;
    this.vehicleName = data.vehicleName;
    this.vehicleType = data.vehicleType;
    this.plateNo = data.plateNo;
    this.brandModel = data.brandModel;
    this.engineNo = data.engineNo;
    this.chassisNo = data.chassisNo;
    this.deptSelected = {value: data.departmentId, text: data.departmentName}
    this.divisionId = data.divisionId;
    this.divisionName = data.divisionName;
    this.jobDescription = data.jobDescription;
    this.remarks = data.remarks;
    this.signatory1Id = data.signatory1Id;
    this.signatory1Name = data.signatory1Name;
    this.signatory2Id = data.signatory2Id;
    this.signatory2Name = data.signatory2Name;
    this.acceptedById = data.acceptedById;
    this.acceptedByName = data.acceptedByName;
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
      this.acceptedById = _xEmp?.id || "";
      this.acceptedByName = _xEmp?.Fullname || "";
    }
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getPostRepairInspectionTransactionNo().subscribe((result) => {
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

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
  }

  deptSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  sectionSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
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
          case "Signatory1":
            this.signatory1Id = result.employee.id;
            this.signatory1Name = result.employee.Fullname;
            break;
          case "Signatory2":
            this.signatory2Id = result.employee.id;
            this.signatory2Name = result.employee.Fullname;
            break;
          default:
            break
        }
      }
    });
  }

  selectPRI() {
    const dialogRef = this.dialog.open(PriSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedPreRepair = result.preRepairInspection;
        
        this.itemDataSource = new MatTableDataSource<PreRepairInspectionItemsModel>(this.selectedPreRepair.items);
        this.vehicleName = this.selectedPreRepair.vehicleName;
        this.vehicleType = this.selectedPreRepair.vehicleType;
        this.plateNo = this.selectedPreRepair.plateNo;
        this.brandModel = this.selectedPreRepair.brandModel;
        this.engineNo = this.selectedPreRepair.engineNo;
        this.chassisNo = this.selectedPreRepair.chassisNo;
        this.jobDescription = this.selectedPreRepair.workScope;
      }
    });
  }

  computeTotal(item: PostRepairInspectionItemsModel) {
    item.total = item.quantity * item.cost;
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
    var data = new PostRepairInspectionModel(
      this.priId,
      this.transactionNo,
      this.transactionDate,
      this.vehicleName,
      this.vehicleType,
      this.plateNo,
      this.brandModel,
      this.engineNo,
      this.chassisNo,
      this.deptSelected.value,
      this.deptSelected.text,
      this.divisionId,
      this.divisionName,
      this.jobDescription,
      this.remarks,
      this.signatory1Id,
      this.signatory1Name,
      this.signatory2Id,
      this.signatory2Name,
      this.acceptedById,
      this.acceptedByName,
      this.itemDataSource.data
    )

    if (this.btnSaveText == "Save") {
      this.httpRequest.savePostRepairInspection(data).subscribe((result) => {
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
      this.httpRequest.updatePostRepairInspection(this.priId, data).subscribe((result) => {
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
    this.deptSelected = {value: "", text: ""};
    this.divisionId = "";
    this.divisionName = "";
    this.jobDescription = "";
    this.remarks = "";
    this.signatory1Id = "";
    this.signatory1Name = "";
    this.signatory2Id = "";
    this.signatory2Name = "";
    this.acceptedById = "";
    this.acceptedByName = "";
    this.itemDataSource.data = [];
    this.btnSaveText = "Save";
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/post-repair-inspection");
    }
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  gotoList() {
    this.router.navigate(["/post-repair-inspection-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

}
