import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApprovedCanvassModel } from 'src/app/data-model/approved-canvass-model';
import { PurchaseOrderItemModel } from 'src/app/data-model/purchase-order-item-model';
import { PurchaseOrderModel } from 'src/app/data-model/purchase-order-model';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { ItemDetailsDialogComponent } from '../project-proposal/item-details-dialog/item-details-dialog.component';
import { CanvassSelectionDialogComponent } from './canvass-selection-dialog/canvass-selection-dialog.component';
import { PrSelectionDialogPoComponent } from './pr-selection-dialog-po/pr-selection-dialog-po.component';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  selectedData: PurchaseOrderModel;
}

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  isLoading: boolean = false;
  currentRowControl = new FormControl(0);
  displayedColumns: string[] = ['description', 'remarks', 'unitMeasure', 'quantity', 'unitCost', 'amount'];
  // displayedColumnsWithAction: string[] = ['unitMeasure', 'quantity', 'description', 'unitCost', 'amount', 'action'];
  itemDataSource = new MatTableDataSource<PurchaseOrderItemModel>([]);
  poId: string = "";
  btnSaveText: string = "Save";
  
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  transactionNo: string = "";
  transactionDate: Date = new Date;
  deliveryPlace: string = "City General Service Office";
  deliveryDate: Date = new Date;
  deliveryTerm: string = "";
  paymentTerm: string = "";
  aocId: string = "";
  aocNo: string = "";
  prId: string = "";
  prNo: string = "";
  procurementMode: string = "";
  supplierId: string = "";
  supplierName: string = "";
  address: string = "";
  contactNumber: string = "";
  supplyDescription: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router,
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<PurchaseOrderComponent>,
    private httpRequest: HttpRequestService
  ) {
    dialogRefx.disableClose = true;
  }

  async ngOnInit(): Promise<void> {
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
        this.httpRequest.getPurchaseOrderById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: PurchaseOrderModel) {
    this.poId = data.id;
    this.transactionNo = data.transactionNo;
    this.transactionDate = data.transactionDate;
    this.deliveryPlace = data.deliveryPlace;
    this.deliveryDate = data.deliveryDate;
    this.deliveryTerm = data.deliveryTerm;
    this.paymentTerm = data.paymentTerm;

    if (data.canvassId != "") {
      this.httpRequest.getApprovedAbstractOfCanvassById(data.canvassId).subscribe((result) => {
        if (result.statusCode == 200) {
          var approvedCanvass: ApprovedCanvassModel;
          approvedCanvass = result.data;

          if (approvedCanvass) {
            this.aocId = approvedCanvass.aoc_id;
            this.aocNo = approvedCanvass.transactionNo;
            this.prId = approvedCanvass.prId;
            this.prNo = approvedCanvass.prNo;
            this.procurementMode = approvedCanvass.procurementMode;
            this.supplierId = approvedCanvass.supplierId;
            this.supplierName = approvedCanvass.supplierName;
            this.address = approvedCanvass.address;
            this.contactNumber = approvedCanvass.contactNumber;
            this.supplyDescription = approvedCanvass.supplyDescription;
          } else {
            this.prId = data.prId;
            this.prNo = data.prNo;
            this.procurementMode = data.procurementMode;
            this.supplierId = data.supplierId;
            this.supplierName = data.supplierName;
            this.address = data.supplierAddress;
            this.contactNumber = data.supplierContactNo;
            this.supplyDescription = data.supplierRemarks;
          }
        }
      });
    } else {
      this.prId = data.prId;
      this.prNo = data.prNo;
      this.procurementMode = data.procurementMode;
      this.supplierId = data.supplierId;
      this.supplierName = data.supplierName;
      this.address = data.supplierAddress;
      this.contactNumber = data.supplierContactNo;
      this.supplyDescription = data.supplierRemarks;
    }
    
    data.items.forEach((item) => {
      this.itemDataSource.data.push(item);
      this.refreshTable();
    });
    this.btnSaveText = "Update";
  }

  async ngAfterViewInit() {
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getPurchaseOrderTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.transactionNo = result.data[0].transactionNo;
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }
  
  selectAOC() {
    const dialogRef = this.dialog.open(CanvassSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var approvedCanvass: ApprovedCanvassModel;
        approvedCanvass = result.approvedCanvass;
        
        this.aocId = approvedCanvass.aoc_id;
        this.aocNo = approvedCanvass.transactionNo;
        this.prId = approvedCanvass.prId;
        this.prNo = approvedCanvass.prNo;
        this.procurementMode = approvedCanvass.procurementMode;
        this.supplierId = approvedCanvass.supplierId;
        this.supplierName = approvedCanvass.supplierName;
        this.address = approvedCanvass.address;
        this.contactNumber = approvedCanvass.contactNumber;
        this.supplyDescription = approvedCanvass.supplyDescription;

        var items: PurchaseOrderItemModel[] = [];
        approvedCanvass.items.forEach(item => {
          items.push(new PurchaseOrderItemModel(
            "",
            item.itemId,
            item.description,
            item.specification,
            item.uom,
            item.quantity,
            item.priceRead,
            item.priceRead * item.quantity,
            item.remarks,
            item.typeId,
          ))
        });
        this.itemDataSource = new MatTableDataSource<PurchaseOrderItemModel>(items);

        this.httpRequest.getRequestQuotationById(approvedCanvass.rfqId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.deliveryTerm = result.data.deliveryPeriod;
            this.paymentTerm = result.data.priceValidity;
          }
        });
      }
    });
  }

  selectPR() {
    const dialogRef = this.dialog.open(PrSelectionDialogPoComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var _pr: PurchaseRequestModel;
        _pr = result.purchaseRequest;
        var items: PurchaseOrderItemModel[] = [];
        _pr.items.forEach(item => {
          items.push(new PurchaseOrderItemModel(
            "",
            item.itemId,
            item.description,
            item.specification,
            item.uom,
            item.quantity,
            item.cost,
            item.total,
            "",
            item.typeId,
          ))
        });
        this.itemDataSource = new MatTableDataSource<PurchaseOrderItemModel>(items);

        this.aocId = "";
        this.aocNo = "";
        this.prId = _pr.id;
        this.prNo = _pr.prNo;
        this.procurementMode = _pr.procurementMode;
        this.supplierId = "";
        this.supplierName = "";
        this.address = "";
        this.contactNumber = "";
        this.supplyDescription = "";
        this.deliveryTerm = "";
        this.paymentTerm = "";
      }
    });
  }

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
  }

  public calculateTotal() {
    return this.itemDataSource?.data?.reduce((accum, curr) => accum + curr.total, 0);
  }

  addItem() {
    const dialogRef = this.dialog.open(ItemDetailsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var item: PurchaseOrderItemModel = new PurchaseOrderItemModel (
          "",
          result.itemId,
          result.description,
          result.specification,
          result.uom,
          result.quantity,
          result.cost,
          result.total,
          result.remarks,
          result.itemType
        );

        this.itemDataSource.data.push(item);
        this.refreshTable();
      }
    });
  }

  computeTotal(cost: any, data: PurchaseOrderItemModel) {
    if (+(cost.target.value.toString().replaceAll(",", "")) <= 0) {
      this.notifService.showNotification(NotificationType.error, "Item Cost must not be lesser than or equal to zero.");
    } else {
      data.total = data.quantity * +(cost.target.value.toString().replaceAll(",", ""));
    }
  }

  editItem(index: number) {
    var selectedItemx: PurchaseOrderItemModel;
    selectedItemx = this.itemDataSource.data[index];
    const dialogRef = this.dialog.open(ItemDetailsDialogComponent, {
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

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (this.itemDataSource.data.length == 0) {
      msg = "Please add Item/s.";
    }
    if (this.procurementMode == "") {
      msg = "Please input Procurement Mode."
    }
    if (this.supplierName == "") {
      msg = "Please input Supplier."
    }
    if (this.deliveryTerm == "") {
      msg = "Please input Delivery Term."
    }
    if (this.paymentTerm == "") {
      msg = "Please input Payment Term."
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
    var data = new PurchaseOrderModel(
      "",
      this.transactionNo,
      this.transactionDate,
      this.aocId,
      this.aocNo,
      this.prId,
      this.prNo,
      this.procurementMode,
      this.supplierId,
      this.supplierName,
      this.address,
      this.contactNumber,
      this.supplyDescription,
      this.deliveryPlace,
      this.deliveryDate,
      this.deliveryTerm,
      this.paymentTerm,
      this.itemDataSource.data
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.savePurchaseOrder(data).subscribe((result) => {
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
      this.httpRequest.updatePurchaseOrder(this.poId, data).subscribe((result) => {
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
    this.deliveryPlace = "City General Service Office";
    this.deliveryDate = new Date;
    this.deliveryTerm = "";
    this.paymentTerm = "";
    this.aocId = "";
    this.aocNo = "";
    this.prId = "";
    this.prNo = "";
    this.procurementMode = "";
    this.supplierId = "";
    this.supplierName = "";
    this.address = "";
    this.contactNumber = "";
    this.supplyDescription = "";
    this.itemDataSource = new MatTableDataSource<PurchaseOrderItemModel>([]);
    this.poId = "";
    this.btnSaveText = "Save";
    this.isLoading = false;
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/purchase-order");
    }
  }

  gotoList() {
    this.router.navigate(["/purchase-order-list"]);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
