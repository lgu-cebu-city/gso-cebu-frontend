import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/data-model/item';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Supplier } from 'src/app/data-model/supplier-model';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  displayedColumns: string[] = ['name', 'address', 'contactNumber', 'contactPerson', 'action'];
  dataSource: MatTableDataSource<Supplier> = new MatTableDataSource<Supplier>([]);
  isProcessing: boolean = false;

  suppId: string = "";
  name: string = "";
  address: string = "";
  contactNumber: string = "";
  contactPerson: string = "";
  btnSaveText: string = "Save";

  constructor(
    public router: Router, 
    private notifService: NotificationService,
    private httpRequest: HttpRequestService
  ) { }
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    this.httpRequest.getSupplierAll().subscribe((result) => {
      if (result.statusCode == 200) {
        this.dataSource = new MatTableDataSource<Supplier>(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (!this.address) {
      msg = "Please input Address";
    }
    if (!this.name) {
      msg = "Please input Supplier Name.";
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
    
    var supp: Supplier = new Supplier(
      this.suppId,
      this.name,
      this.address,
      this.contactNumber,
      this.contactPerson
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveSupplier(supp).subscribe((result) => {
        if (result.statusCode == 201) {
          this.clear();
          this.loadData();
          this.notifService.showNotification(NotificationType.success, "Successfully saved!");
        } else {
          this.notifService.showNotification(NotificationType.error, "Saving Data Failed!");
        }
      });
    } else if (this.btnSaveText == "Update") {
      this.httpRequest.updateSupplier(this.suppId, supp).subscribe((result) => {
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

  editData(supp: Supplier) {
    this.suppId = supp.id;
    this.name = supp.name;
    this.address = supp.address;
    this.contactNumber = supp.contactNumber;
    this.contactPerson = supp.contactPerson;
    this.btnSaveText = "Update";
  }

  deleteData(item: Item) {
    this.httpRequest.deleteSupplier(item.id).subscribe((result) => {
      this.loadData();
      this.notifService.showNotification(NotificationType.success, "Successfully deleted!");
    });
  }

  clear() {
    this.suppId = "";
    this.name = "";
    this.address = "";
    this.contactNumber = "";
    this.contactPerson = "";
    this.btnSaveText = "Save";
  }
}
