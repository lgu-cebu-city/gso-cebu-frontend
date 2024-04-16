import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Accounts } from 'src/app/data-model/Accounts';
import { Department } from 'src/app/data-model/department';
import { FundCategory } from 'src/app/data-model/fund-category';
import { Group } from 'src/app/data-model/group';
import { ProjectProposalModel } from 'src/app/data-model/project-proposal-model';
import { ProjectProposalSOFModel } from 'src/app/data-model/project-proposal-sof-model';
import { PurchaseRequestItemsModel } from 'src/app/data-model/purchase-request-items-model';
import { PurchaseRequestModel } from 'src/app/data-model/purchase-request-model';
import { SOF } from 'src/app/data-model/sof';
import { Type } from 'src/app/data-model/type';
import { EmployeeSelectionComponent } from 'src/app/employee-selection/employee-selection.component';
import { ConfirmationDialogComponent } from 'src/app/navbar/confirmation-dialog/confirmation-dialog.component';
import { AuthService, iEmp } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { FundListDialogComponent } from '../project-proposal/fund-list-dialog/fund-list-dialog.component';
import { PrSelectionDialogConsolidateComponent } from './pr-selection-dialog-consolidate/pr-selection-dialog-consolidate.component';
import { ImageAttachmentModel } from 'src/app/data-model/image-attachment-model';

export interface DialogData {
  selectedData: PurchaseRequestModel;
  departmentSelection: Department[];
  deptList: Department[];
  catList: FundCategory[];
  sofList: SOF[];
  defaultDept: "";
  employees: any;
  isCallout: boolean;
}

@Component({
  selector: 'app-purchase-request-consolidate',
  templateUrl: './purchase-request-consolidate.component.html',
  styleUrls: ['./purchase-request-consolidate.component.scss']
})
export class PurchaseRequestConsolidateComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  isLoading: boolean = false;
  formControl = new FormControl('');
  purchaseRequestFormGroup: FormGroup;
  displayedColumns: string[] = ['no', 'description', 'quantity', 'dbmQty', 'unitMeasure', 'unitCost', 'totalCost'];
  displayedColumnsWithAction: string[] = ['action', 'no', 'description', 'quantity', 'dbmQty', 'unitMeasure', 'unitCost', 'totalCost'];
  itemDataSource = new MatTableDataSource<PurchaseRequestItemsModel>([]);
  departmentSelection: Department[] = [];
  sectionSelection: Department[] = [];
  selectedPP: ProjectProposalModel = null;
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  sectionSelected: { value: string; text: string } = {value: "", text: ""};
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  dataSource: Accounts[] = [];
  selectedSOF: Accounts[] = [];
  fundCategorySelection: FundCategory[] = [];
  sofSelection: SOF[] = [];
  selectedItemType: string;
  selectedItemTypeId: string;
  filteredGroupType: Observable<Group[]>;
  filteredType: Type[];
  selection = new SelectionModel<PurchaseRequestItemsModel>(true, []);
  prId: string = "";
  isCallout: boolean = false;
  selectedPRs: string[] = [];
  btnSaveText: string = "Save";
  textFilterStr: string = "";

  quarter: string = "";
  employees: iEmp[];
  requestedByName: string;
  requestedByPosition: string;
  cashAvailabilityName: string;
  cashAvailabilityPosition: string;
  approvedByName: string;
  approvedByPosition: string;

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    public router: Router, 
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<PurchaseRequestConsolidateComponent>,
    private httpRequest: HttpRequestService
  ) {
    dialogRefx.disableClose = true;
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.loadEmployees();
    this.loadDepartment();
    this.loadSection();
    this.loadFundCategory();
    this.loadSOF();
    this.setQuarter(new Date());
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
      this.isCallout = this.data.isCallout || false;
    }
    this.route.params.subscribe((param: Params) =>  {
      if (param['id']) {
        var paramId = param['id'];
        this.removeParam();
        this.httpRequest.getPurchaseRequestById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: PurchaseRequestModel) {
    this.prId = data.id;
    this.purchaseRequestFormGroup.controls['prType'].setValue(data.prType);
    this.purchaseRequestFormGroup.controls['prNo'].setValue(data.prNo);
    this.purchaseRequestFormGroup.controls['prDate'].setValue(data.prDate);
    this.purchaseRequestFormGroup.controls['title'].setValue(data.title);
    this.purchaseRequestFormGroup.controls['alobsNo'].setValue(data.alobsNo);
    this.purchaseRequestFormGroup.controls['alobsDate'].setValue(data.alobsDate);
    this.purchaseRequestFormGroup.controls['saiNo'].setValue(data.saiNo);
    this.purchaseRequestFormGroup.controls['saiDate'].setValue(data.saiDate);
    this.purchaseRequestFormGroup.controls['transactionNo'].setValue(data.transactionNo);
    this.purchaseRequestFormGroup.controls['transactionDate'].setValue(data.transactionDate);
    this.purchaseRequestFormGroup.controls['ppNo'].setValue(data.ppNo);
    this.purchaseRequestFormGroup.controls['sourceOfFund'].setValue(data.sourceOfFund);
    this.purchaseRequestFormGroup.controls['rationale'].setValue(data.rationale);
    this.purchaseRequestFormGroup.controls['procurementMode'].setValue(data.procurementMode);
    this.deptSelected.value = data.departmentId.toString();
    this.deptSelected.text = data.departmentName;
    this.sectionSelected.value = data.sectionId.toString();
    this.sectionSelected.text = data.sectionName;
    this.quarter = data.prQtr;
    this.requestedByName = data.requestedByName;
    this.requestedByPosition = data.requestedByPosition;
    this.cashAvailabilityName = data.cashAvailabilityName;
    this.cashAvailabilityPosition = data.cashAvailabilityPosition;
    this.approvedByName = data.approvedByName;
    this.approvedByPosition = data.approvedByPosition;

    if (data.ppId) {
      this.httpRequest.getProjectProposalById(data.ppId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.selectedPP = result.data;
        }
      });
    }

    var ids: number[] = [];
    data.sof.forEach((sof) => {
      ids.push(sof.sofId);
    });
    
    if (ids.length > 0) {
      this.httpRequest.getSourceOfFundByIds(ids).subscribe((result) => {
        if (result.statusCode == 201) {
          this.selectedSOF = result.data;
  
          this.itemDataSource.data = this.formatPRItems(data.items);
          this.refreshTable();
        }
      });
    } else {
      this.notifService.showNotification(NotificationType.error, "Cannot load items in this transaction. No Source Of Fund.");
    }
    
    this.btnSaveText = "Update";
  }

  initForm() {
    this.purchaseRequestFormGroup = new FormGroup({
      prType: new FormControl("Direct PR", [Validators.required]),
      prNo: new FormControl(""),
      prDate: new FormControl(new Date()),
      title: new FormControl(""),
      alobsNo: new FormControl(""),
      alobsDate: new FormControl(null),
      saiNo: new FormControl(""),
      saiDate: new FormControl(null),
      transactionNo: new FormControl(""),
      transactionDate: new FormControl(new Date()),
      ppNo: new FormControl(""),
      sourceOfFund: new FormControl("", [Validators.required]),
      rationale: new FormControl("", [Validators.required]),
      procurementMode: new FormControl("Small Value Procurement", [Validators.required]),
    });
  }

  async ngAfterViewInit() {
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.itemDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.itemDataSource.data.forEach(row => this.selection.select(row));
  }

  getTransactionNo(): Promise<any> {
    return new Promise((res, rej) => {
      this.httpRequest.getPurchaseRequestTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          this.purchaseRequestFormGroup.controls['prNo'].setValue(result.data[0].transactionNo);
          this.purchaseRequestFormGroup.controls['transactionNo'].setValue(result.data[0].transactionNo);
          return res(true);
        } else {
          return rej(false);
        }
      });
    });
  }

  setQuarter(date: Date) {
    switch(Math.floor(((date).getMonth() + 3) / 3)) {
      case 1:
        this.quarter = "Q1"
        break;
      case 2:
        this.quarter = "Q2"
        break;
      case 3:
        this.quarter = "Q3"
        break;
      case 4:
        this.quarter = "Q4"
        break;
    }
  }

  loadDepartment() {
    this.departmentSelection = this.authService.listDepartment;

    var deptx: Department = this.departmentSelection.find(d => d.id == this.authService.getTypeId());
    this.deptSelected = {value: deptx.id, text: deptx.name};
  }

  loadSection() {
    // this.httpRequest.getDepartmentAll().subscribe((result) => {
    //   if (result.statusCode == 200) {
    //     this.sectionSelection = result.data;
    //   }
    // });
  }

  loadFundCategory() {
    this.httpRequest.getFundCategory().subscribe((result) => {
      if (result.statusCode == 200) {
        this.fundCategorySelection = result.data;
      }
    });
  }

  loadSOF() {
    this.httpRequest.getSOF().subscribe((result) => {
      if (result.statusCode == 200) {
        this.sofSelection = result.data;
      }
    });
  }

  loadEmployees() {
    this.employees = this.authService.listEmployee;

    var currUser = this.employees.find((x) => x.id == this.authService.getEmpId());
    this.requestedByName = currUser.Fullname;
    this.requestedByPosition = this.authService.getPositionName();
    var treasurer = this.employees.find((x) => x.positionId == environment.cityTreasurerPositionId);
    this.cashAvailabilityName = treasurer.Fullname;
    this.cashAvailabilityPosition = treasurer.Position;
    var mayor = this.employees.find((x) => x.positionId == environment.cityMayorPositionId);
    this.approvedByName = mayor.Fullname;
    this.approvedByPosition = mayor.Position;
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.itemDataSource.filter = filterValue;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (!this.deptSelected.value) {
      msg = "Please select Department.";
    }
    if (this.itemDataSource.data.length == 0) {
      msg = "Please add Item/s.";
    }
    if (this.requestedByName == "") {
      msg = "Please select Requestor."
    }
    if (this.cashAvailabilityName == "") {
      msg = "Please select Cash Availability Personnel."
    }
    if (this.approvedByName == "") {
      msg = "Please select Approver."
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
    if (!this.purchaseRequestFormGroup.valid) return;
    if (this.isLoading) return;
    this.isLoading = true;

    if (this.isCallout) {
      this.saveCallout();
      return;
    }

    var saveSOFList: ProjectProposalSOFModel[] = [];
    this.selectedSOF.forEach((sof) => {
      var s = new ProjectProposalSOFModel(
        sof.id,
        sof.description,
        sof.budgetYear,
        sof.amount
      );
      saveSOFList.push(s);
    });

    var saveImgAtt: ImageAttachmentModel[] = [];

    var data = new PurchaseRequestModel(
      "",
      this.purchaseRequestFormGroup.get("prType")?.value || "",
      this.purchaseRequestFormGroup.get("prNo")?.value,
      this.purchaseRequestFormGroup.get("prDate")?.value,
      this.quarter,
      this.purchaseRequestFormGroup.get("title")?.value,
      this.deptSelected.value,
      this.deptSelected.text,
      Number.parseInt(this.sectionSelected.value) || 0,
      this.sectionSelected.text,
      this.purchaseRequestFormGroup.get("alobsNo")?.value,
      this.purchaseRequestFormGroup.get("alobsDate")?.value,
      this.purchaseRequestFormGroup.get("saiNo")?.value,
      this.purchaseRequestFormGroup.get("saiDate")?.value,
      this.purchaseRequestFormGroup.get("transactionNo")?.value,
      this.purchaseRequestFormGroup.get("transactionDate")?.value,
      this.selectedPP?.id || "",
      this.selectedPP?.referenceNo || "",
      this.purchaseRequestFormGroup.get("sourceOfFund")?.value,
      this.purchaseRequestFormGroup.get("rationale")?.value,
      this.purchaseRequestFormGroup.get("procurementMode")?.value || "",
      this.authService.getTypeId(),
      this.authService.getUserId(),
      this.requestedByName,
      this.requestedByPosition,
      this.cashAvailabilityName,
      this.cashAvailabilityPosition,
      this.approvedByName,
      this.approvedByPosition,
      "CONSOLIDATED",
      saveSOFList,
      saveImgAtt,
      this.itemDataSource.data.filter(_itm => _itm.itemId != "")
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.getPurchaseRequestTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          data.transactionNo = result.data[0].transactionNo;
          data.prNo = result.data[0].transactionNo;
          
          this.httpRequest.savePurchaseRequest(data).subscribe((result) => {
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
        }
      });
    } else if (this.btnSaveText == "Update") {
      this.httpRequest.updatePurchaseRequest(this.prId, data).subscribe((result) => {
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

  saveCallout() {
    var _items = this.itemDataSource.data.filter(_itm => _itm.itemId != "");
    var prItems1: PurchaseRequestItemsModel[] = [];
    var prItems2: PurchaseRequestItemsModel[] = [];
    _items.forEach((item) => {
      var prItem = this.selection.selected.find((ii) => ii.id == item.id);
      if (prItem) {
        prItem.id = "";
        if (prItem.quantity == prItem.dbmQty) {
          prItems1.push(prItem);
        } else {
          var _item1 = prItem;
          var _item2 = prItem;
          
          _item1.quantity = _item1.dbmQty;
          _item1.dbmQty = 0;

          _item2.quantity = _item2.quantity - _item2.dbmQty;
          _item2.dbmQty = 0;

          prItems1.push(_item1);
          prItems2.push(_item2);
        }
      } else {
        item.id = "";
        prItems2.push(item);
      }
    });

    this.savePR(prItems1, true).then((result) => {
      this.savePR(prItems2).then((result) => {
        this.notifService.showNotification(NotificationType.success, "Successfully saved!");
        if (this.envFirstLoad == "List") {
          this.saveUpdateSuccess();
        } else {
          this.clearFields();
        }
      });
    });
  }

  savePR(prItems: PurchaseRequestItemsModel[], isForDBM: boolean = false) {
    return new Promise((res, rej) => {
      var saveSOFList: ProjectProposalSOFModel[] = [];
      this.selectedSOF.forEach((sof) => {
        var s = new ProjectProposalSOFModel(
          sof.id,
          sof.description,
          sof.budgetYear,
          sof.amount
        );
        saveSOFList.push(s);
      });

      var saveImgAtt: ImageAttachmentModel[] = [];

      this.httpRequest.getPurchaseRequestTransactionNo().subscribe((result) => {
        if (result.statusCode == 200) {
          var data = new PurchaseRequestModel(
            "",
            this.purchaseRequestFormGroup.get("prType")?.value || "",
            result.data[0].transactionNo,
            this.purchaseRequestFormGroup.get("prDate")?.value,
            this.quarter,
            this.purchaseRequestFormGroup.get("title")?.value,
            this.deptSelected.value,
            this.deptSelected.text,
            Number.parseInt(this.sectionSelected.value) || 0,
            this.sectionSelected.text,
            this.prId, // PR Id from Consolidated PR
            this.purchaseRequestFormGroup.get("alobsDate")?.value,
            this.purchaseRequestFormGroup.get("saiNo")?.value,
            this.purchaseRequestFormGroup.get("saiDate")?.value,
            result.data[0].transactionNo,
            this.purchaseRequestFormGroup.get("transactionDate")?.value,
            this.selectedPP?.id || "",
            this.selectedPP?.referenceNo || "",
            this.purchaseRequestFormGroup.get("sourceOfFund")?.value,
            this.purchaseRequestFormGroup.get("rationale")?.value,
            this.purchaseRequestFormGroup.get("procurementMode")?.value || "",
            this.authService.getTypeId(),
            this.authService.getUserId(),
            this.requestedByName,
            this.requestedByPosition,
            this.cashAvailabilityName,
            this.cashAvailabilityPosition,
            this.approvedByName,
            this.approvedByPosition,
            "ACTIVE",
            saveSOFList,
            saveImgAtt,
            prItems.filter(_prItem => _prItem.itemId != ""),
            isForDBM
          );
    
          this.httpRequest.savePurchaseRequest(data).subscribe((result) => {
            if (result.statusCode != 201) {
              this.notifService.showNotification(NotificationType.error, "Saving Data Failed!");
            }
            res(true);
          });
        }
      });
    });
  }
  
  saveUpdateSuccess() {
    var result = true;
    this.dialogRefx.close(result);
  }
  
  clearFields() {
    this.purchaseRequestFormGroup.reset();
    Object.keys(this.purchaseRequestFormGroup.controls).forEach(key => {
      this.purchaseRequestFormGroup.get(key)?.setErrors(null) ;
    });
    this.itemDataSource = new MatTableDataSource<PurchaseRequestItemsModel>([]);
    this.selectedPP = null;
    this.selectedSOF = [];
    this.selectedPRs = [];
    this.purchaseRequestFormGroup.controls['prType'].setValue("Direct PR");
    this.purchaseRequestFormGroup.controls['procurementMode'].setValue("Small Value Procurement");
    this.purchaseRequestFormGroup.controls['prDate'].setValue(new Date());
    this.purchaseRequestFormGroup.controls['alobsDate'].setValue(null);
    this.purchaseRequestFormGroup.controls['saiDate'].setValue(null);
    this.purchaseRequestFormGroup.controls['transactionDate'].setValue(new Date());
    if (this.authService.getTypeId() != environment.gsoDeptId.toString()) {
      var deptx: Department = this.departmentSelection.find(d => d.id == this.authService.getTypeId());
      this.deptSelected = {value: deptx.id, text: deptx.name};
    } else {
      this.deptSelected = {value: "", text: ""};
    }
    this.sectionSelected = {value: "", text: ""};
    this.prId = "";
    this.btnSaveText = "Save";
    this.isLoading = false;
    this.removeParam();
    this.getTransactionNo();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/purchase-request");
    }
  }

  gotoList() {
    this.router.navigate(["/purchase-request-list"]);
  }

  selectFund() {
    const dialogRef = this.dialog.open(FundListDialogComponent, {
      data: {
        sofData: this.dataSource, 
        selectedFund: this.selectedSOF,
        deptList: this.departmentSelection,
        catList: this.fundCategorySelection,
        sofList: this.sofSelection,
        defaultDept: this.deptSelected?.value || ""
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deptSelected = result.department;
        this.selectedSOF = result.selectedFund;
        this.purchaseRequestFormGroup.controls['sourceOfFund'].setValue(result.selectedSOF);
      }
    });
  }

  selectPRs() {
    const dialogRef = this.dialog.open(PrSelectionDialogConsolidateComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedSOF = [];
        this.selectedPRs = [];
        var _prItemsTemp: PurchaseRequestItemsModel[] = [];
        var _sofIds: number[] = [];
        result.prSelected.forEach((pr: PurchaseRequestModel) => {
          this.selectedPRs.push(pr.id);
          pr.items.forEach((prItem: PurchaseRequestItemsModel) => {
            prItem.id = "";
            prItem.consPrId = pr.id;
            prItem.dbmQty = prItem.quantity;
            var existItemIndex: number;
            existItemIndex = _prItemsTemp.findIndex(x => x.itemId == prItem.itemId);
            if (existItemIndex < 0) {
              _prItemsTemp.push(prItem)
            } else {
              _prItemsTemp[existItemIndex].quantity += prItem.quantity;
              _prItemsTemp[existItemIndex].dbmQty += prItem.quantity;
              _prItemsTemp[existItemIndex].consPrId = _prItemsTemp[existItemIndex].consPrId + " | " + prItem.consPrId;
              _prItemsTemp[existItemIndex].total += prItem.total;
            }

            this.refreshTable();

            pr.sof.forEach((sof) => {
              if (!_sofIds.find(_xsof => _xsof == sof.sofId)) {
                _sofIds.push(sof.sofId);
              }
            });
          });
        });

        if (_sofIds.length > 0) {
          this.httpRequest.getSourceOfFundByIds(_sofIds).subscribe((result) => {
            if (result.statusCode == 201) {
              this.selectedSOF = result.data;
              this.itemDataSource.data = this.formatPRItems(_prItemsTemp);
            }
          });
        } else {
          this.notifService.showNotification(NotificationType.error, "Cannot load items in this transaction. No Source Of Fund.");
        }
        this.purchaseRequestFormGroup.controls['sourceOfFund'].setValue(result.prSelected[0].sourceOfFund);
        this.purchaseRequestFormGroup.controls['title'].setValue(this.selectedPRs.join());
      }
    });
  }

  formatPRItems(_items: PurchaseRequestItemsModel[]): PurchaseRequestItemsModel[] {
    _items = _items.filter(itm => itm.itemId != '');
    _items.sort((a,b) => {
      if (a.description.toLowerCase() < b.description.toLowerCase()) {
        return -1;
      }
      if (a.description.toLowerCase() > b.description.toLowerCase()) {
          return 1;
      }
      return 0;
    });
    var _itemsTemp: PurchaseRequestItemsModel[] = [];

    this.selectedSOF.sort((a,b) => {
      if (a.code < b.code) { return -1; }
      if (a.code > b.code) { return 1; }
      return 0;
    });

    var _tempSofs: {id: number[], code: string, description: string, amount:number}[] = [];
    this.selectedSOF.forEach(_sof => {
      var _exSof = _tempSofs.find(_s => _s.code == _sof.code);
      if (_exSof) {
        _exSof.id.push(_sof.id);
        _exSof.amount += +_sof.amount;
      } else {
        _tempSofs.push({id: [_sof.id], code: _sof.code, description: _sof.description, amount: +_sof.amount});
      }
    });

    _tempSofs.forEach((_sof) => {
      var _sItems: PurchaseRequestItemsModel[] = _items.filter(_itm => _sof.id.includes(_itm.accId));
      _itemsTemp.push(... _sItems);
      _itemsTemp.push(new PurchaseRequestItemsModel(
        "",
        "",
        _sof.description + ": " + this.numberFormat.format(_sof.amount),
        "",
        "",
        0,
        0,
        0,
        "",
        0,
        _sItems.reduce((accum, curr) => accum + curr.total, 0),
        ""
      ));
    });

    // Items that are not from Budget - APP Start
    var _sItemsNoAcc: PurchaseRequestItemsModel[] = _items.filter(_itm => _itm.accId == null);
    if (_sItemsNoAcc.length > 0) {
      _itemsTemp.push(... _sItemsNoAcc);
      _itemsTemp.push(new PurchaseRequestItemsModel(
        "",
        "",
        "Not from PPMP",
        "",
        "",
        0,
        0,
        0,
        "",
        0,
        _sItemsNoAcc.reduce((accum, curr) => accum + curr.total, 0),
        ""
      ));
    }
    // Items that are not from Budget - APP End

    var _ctr: number = 1;
    _itemsTemp.forEach((_itm) => {
      if (_itm.itemId != '') {
        _itm.id = _ctr.toString();
        _ctr += 1;
      }
    });

    return _itemsTemp;
  }

  compareQty(item: PurchaseRequestItemsModel) {
    if (item.quantity < item.dbmQty) {
      this.notifService.showNotification(NotificationType.error, "Quantity for DBM for <b>" + item.description +  "</b> must be less than or equal to item quantity.");
      item.dbmQty = item.quantity;
    }
  }

  deptSelectedValue(event: MatSelectChange) {
    this.deptSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  sectionSelectedValue(event: MatSelectChange) {
    this.sectionSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  autoCompleteSelectedValue(event: any) {
    this.sectionSelected = {
      value: event.value,
      text: event.source.triggerValue
    };
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
          case "RequestedBy":
            this.requestedByName = result.employee.Fullname;
            this.requestedByPosition = result.employee.Position || "";
            break;
          case "CashAvailability":
            this.cashAvailabilityName = result.employee.Fullname;
            this.cashAvailabilityPosition = result.employee.Position || "";
            break;
          case "ApprovedBy":
            this.approvedByName = result.employee.Fullname;
            this.approvedByPosition = result.employee.Position || "";
            break;
        }
      }
    });
  }

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
  }

  public calculateTotal() {
    return this.itemDataSource?.data?.reduce((accum, curr) =>  curr.itemId != '' ? accum + curr.total : accum, 0);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
