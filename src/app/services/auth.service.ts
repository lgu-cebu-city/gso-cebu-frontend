import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Department } from '../data-model/department';
import { NotificationType } from '../util/notification_type';
import { HttpRequestService } from './http-request.service';
import { NotificationService } from './notification.service';
import { Accounts } from '../data-model/Accounts';
  
const jwtHelper = new JwtHelperService();

export interface iEmp {
  type: string,
  id: string,
  Fullname: string,
  departmentId: string,
  Department: string,
  positionId: string,
  Position: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public listEmployee: iEmp[] = [];
  public listDefaultSignatory: iEmp[] = [];
  public listDepartment: Department[] = [];
  public listAccounts: Accounts[] = [];

  constructor(
    private httpRequest: HttpRequestService,
    private notifService : NotificationService,
  ) {
    this.loadDepartment();
    this.loadEmployees();
    this.loadAccounts();
  }
  // ...

  loadEmployees() {
    this.httpRequest.getEmployees().subscribe({
      next: (result) => {
        this.listEmployee = result.data[0];
      },
      error: (err) => {
        this.notifService.showNotification(NotificationType.error, err.message);
      }
    });
  }

  loadDefaultSignatory(_deptId: string) {
    this.httpRequest.getDefaultSignatory(_deptId).subscribe({
      next: (result) => {
        this.listDefaultSignatory = result.data[0];
      },
      error: (err) => {
        this.notifService.showNotification(NotificationType.error, err.message);
      }
    });
  }

  loadDepartment() {
    this.httpRequest.getDepartmentAll().subscribe({
      next: (result) => {
        this.listDepartment = result.data;

        if (this.getTypeId()) {
          var _deptId: string = this.listDepartment.find(d => d.id == this.getTypeId()).prefix;
          this.loadDefaultSignatory(_deptId);
        }
      },
      error: (err) => {
        this.notifService.showNotification(NotificationType.error, err.message);
      }
    });
  }

  loadAccounts() {
    this.httpRequest.getAccounts(new Date().getFullYear().toString()).subscribe({
      next: (result) => {
        this.listAccounts = result.data;
      },
      error: (err) => {
        this.notifService.showNotification(NotificationType.error, err.message);
      }
    });
  }

  public isAuthenticated(): boolean {
    const loginStatus = sessionStorage.getItem("isLoggedIn");

    return loginStatus == "true";
    

    // const token = localStorage.getItem('accessToken') || "";
    // return !jwtHelper.isTokenExpired(token);

    // return true;
  }

  userLogin(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpRequest.isUserAvailable(username, password).subscribe((result) => {
        if (result.statusCode == 201 && result.data.isUserValid) {
          sessionStorage.setItem("isLoggedIn", result.data.isUserValid);
          sessionStorage.setItem("userId", result.data.userId);
          sessionStorage.setItem("username", result.data.username);
          sessionStorage.setItem("name", result.data.name);
          sessionStorage.setItem("userType", result.data.userType);
          sessionStorage.setItem("typeId", result.data.typeId);
          sessionStorage.setItem("typeName", result.data.typeName);
          sessionStorage.setItem("empId", result.data.empId);
          sessionStorage.setItem("positionId", result.data.positionId);
          sessionStorage.setItem("positionName", result.data.positionName);
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  getUserId(): string {
    return sessionStorage.getItem("userId");
  }

  getUserName(): string {
    return sessionStorage.getItem("username");
  }

  getName(): string {
    return sessionStorage.getItem("name");
  }

  getUserType(): string {
    return sessionStorage.getItem("userType");
  }

  getTypeId(): string {
    return sessionStorage.getItem("typeId");
  }

  getTypeName(): string {
    return sessionStorage.getItem("typeName");
  }

  getPositionId(): string {
    return sessionStorage.getItem("positionId");
  }

  getPositionName(): string {
    return sessionStorage.getItem("positionName");
  }

  getEmpId(): string {
    return sessionStorage.getItem("empId");
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
