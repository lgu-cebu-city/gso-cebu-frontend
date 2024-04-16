import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { UserModel } from 'src/app/data-model/user-model';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { Department } from 'src/app/data-model/department';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.css']
})
export class UserSetupComponent implements OnInit {
  displayedColumns: string[] = ['username','name', 'department', 'action'];
  dataSource: MatTableDataSource<UserModel> = new MatTableDataSource<UserModel>([]);
  employee: iEmp[] = [];
  department: Department[] = [];
  isProcessing: boolean = false;

  userId: string = "";
  userName: string = "";
  password: string = "";
  empId: string = "";
  empName: string = "";
  positionId: string = "";
  positionName: string = "";
  deptSelected: {value: string, text: string} = {value: "", text: ""};
  btnSaveText: string = "Save";

  constructor(
    private authService: AuthService,
    public router: Router, 
    private notifService: NotificationService,
    public dialog: MatDialog,
    private httpRequest: HttpRequestService
  ) { }
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    this.employee = this.authService.listEmployee;
    this.loadData();
    this.loadDepartment();
  }

  loadData() {
    this.httpRequest.getUsers().subscribe((result) => {
      if (result.statusCode == 200) {
        this.dataSource = new MatTableDataSource<UserModel>(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  loadDepartment() {
    this.department = this.authService.listDepartment;
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  deptSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };

    if (event.value != undefined) {
      var _dd: Department = this.department.find((d) => d.id == event.value);
      this.positionId = _dd.positionId ?? "";
      this.positionName = _dd.position_name ?? "";

      if (_dd.emp_head) {
        this.empId = _dd.emp_head;
        this.empName = this.authService.listEmployee.find((e) => e.id == _dd.emp_head).Fullname;
      } else {
        this.empId = "";
        this.empName = "";
      }
    } else {
      this.positionId = "";
      this.positionName = "";
      this.empName = "";
    }
  }

  selectEmployee() {
    const dialogRef = this.dialog.open(EmployeeSelectionComponent, {
      data: {
        employees: this.employee
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.employee) {
        this.empName = result.employee.Fullname;
        this.empId = result.employee.id;
      }
    });
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (!this.userName) {
      msg = "Please input Username";
    }
    if (!this.password) {
      msg = "Please input Password";
    }
    if (!this.deptSelected.value) {
      msg = "Please select Department";
    }
    if (!this.empId) {
      msg = "Please select Employee";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    var isDataValid = this.isEntryValid();
    
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      this.isProcessing = false;
      return;
    }

    var user: UserModel = new UserModel(
      this.userId,
      this.userName,
      this.password,
      this.empId,
      this.empName,
      "department",
      this.deptSelected.value,
      this.department.find(x => x.id == this.deptSelected.value).description,
      this.positionId,
      this.positionName,
      "",
      ""
    )

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveUser(user).subscribe((result) => {
        if (result.statusCode == 201) {
          this.clear();
          this.loadData();
          this.notifService.showNotification(NotificationType.success, "Successfully saved!");
        } else {
          this.notifService.showNotification(NotificationType.error, "Saving Data Failed!");
        }
      });
    } else if (this.btnSaveText == "Update") {
      this.httpRequest.updateUser(this.userId, user).subscribe((result) => {
        if (result.statusCode == 200) {
          this.clear();
          this.loadData();
          this.notifService.showNotification(NotificationType.success, "Successfully updated!");
        } else {
          this.notifService.showNotification(NotificationType.error, "Updating Data Failed!");
        }
      });
    }
    this.isProcessing = false;
  }

  editData(user: UserModel) {
    this.userId = user.id;
    this.userName = user.username;
    this.password = "***********";
    this.empId = user.empId;
    this.empName = user.name;
    this.deptSelected = {value: user.typeId, text: user.typeName};
    this.btnSaveText = "Update";
  }

  deleteData(user: UserModel) {
    this.httpRequest.deleteUser(user.id).subscribe((result) => {
      this.loadData();
      this.notifService.showNotification(NotificationType.success, "Successfully deleted!");
    });
  }

  clear() {
    this.userId = "";
    this.userName = "";
    this.password = "";
    this.empId = "";
    this.empName = "";
    this.deptSelected = {value: "", text: ""};
    this.btnSaveText = "Save";
  }

  gotoList() {
    // this.router.navigate(["/purchase-request-list"]);
  }
}
