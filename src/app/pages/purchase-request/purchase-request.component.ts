import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Accounts } from 'src/app/data-model/Accounts';
import { Department } from 'src/app/data-model/department';
import { FundCategory } from 'src/app/data-model/fund-category';
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
import { AppSelectionDialogComponent } from './app-selection-dialog/app-selection-dialog.component';
import { PpSelectionDialogComponent } from './pp-selection-dialog/pp-selection-dialog.component';
import { PrItemDetailsDialogComponent } from './pr-item-details-dialog/pr-item-details-dialog.component';
import { ImageAttachmentModel } from 'src/app/data-model/image-attachment-model';

export interface DialogData {
  selectedData: PurchaseRequestModel;
  selectedItem: PurchaseRequestItemsModel;
  selectedTypeId: string;
  itemCategory: string;
  departmentSelection: Department[];
  deptList: Department[];
  catList: FundCategory[];
  selectedFund: Accounts[];
  sofList: SOF[];
  typeList: Type[];
  defaultDept: "";
  employees: any;
  defaultEmployees: any;
}

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.scss']
})
export class PurchaseRequestComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  fileName: string = '';
  filesSelected: File[] = [];
  isLoading: boolean = false;
  formControl = new FormControl('');
  purchaseRequestFormGroup: FormGroup;
  displayedColumns: string[] = ['no','description', 'quantity', 'unitMeasure', 'unitCost', 'totalCost', 'action'];
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
  prId: string = "";
  isAPPSelected: boolean = false;
  btnSaveText: string = "Save";

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
    private dialogRefx: MatDialogRef<PurchaseRequestComponent>,
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
      prNo: new FormControl("", [Validators.required]),
      prDate: new FormControl(new Date(), [Validators.required]),
      title: new FormControl(""),
      alobsNo: new FormControl(""),
      alobsDate: new FormControl(null),
      saiNo: new FormControl(""),
      saiDate: new FormControl(null),
      transactionNo: new FormControl("", [Validators.required]),
      transactionDate: new FormControl(new Date(), [Validators.required]),
      ppNo: new FormControl(""),
      sourceOfFund: new FormControl("", [Validators.required]),
      rationale: new FormControl("", [Validators.required]),
      procurementMode: new FormControl("Small Value Procurement", [Validators.required]),
    });
  }

  async ngAfterViewInit() {
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
        // for (var i = 0; i < this.filesSelected.length; i++ ) {
        //   this.httpRequest.savePurchaseRequestAttachment(this.filesSelected[i]).subscribe({
        //     next: (val) => {
        //       console.log(val);
        //     },
        //     error: (err) => {
        //       console.log(err);
        //     }
        //   });
        // }
      }
    });
  }

  saveData() {
    var isDataValid = this.isEntryValid();
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }
    if (!this.purchaseRequestFormGroup.valid) {
      if (!this.purchaseRequestFormGroup.controls['rationale'].valid) {
        this.notifService.showNotification(NotificationType.error, "Please input Purpose!");
        return;
      }
      return;
    };
    if (this.isLoading) return;
    this.isLoading = true;
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
      this.purchaseRequestFormGroup.get("transactionNo")?.value,
      this.purchaseRequestFormGroup.get("transactionDate")?.value,
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
      "ACTIVE",
      saveSOFList,
      saveImgAtt,
      this.itemDataSource.data.filter(_item => _item.itemId != '')
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
    this.purchaseRequestFormGroup.controls['prType'].setValue("Direct PR");
    this.purchaseRequestFormGroup.controls['procurementMode'].setValue("Small Value Procurement");
    this.purchaseRequestFormGroup.controls['prDate'].setValue(new Date());
    this.purchaseRequestFormGroup.controls['alobsDate'].setValue(null);
    this.purchaseRequestFormGroup.controls['saiDate'].setValue(null);
    this.purchaseRequestFormGroup.controls['transactionDate'].setValue(new Date());
    var deptx: Department = this.departmentSelection.find(d => d.id == this.authService.getTypeId());
    this.deptSelected = {value: deptx.id, text: deptx.name};
    this.sectionSelected = {value: "", text: ""};
    this.prId = "";
    this.btnSaveText = "Save";
    this.isLoading = false;
    this.isAPPSelected = false;
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

  selectPP() {
    const dialogRef = this.dialog.open(PpSelectionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedPP = result.projectProposal;
        this.purchaseRequestFormGroup.controls['ppNo'].setValue(this.selectedPP.referenceNo);
        this.purchaseRequestFormGroup.controls['sourceOfFund'].setValue(this.selectedPP.sourceOfFund);
        this.purchaseRequestFormGroup.controls['rationale'].setValue(this.selectedPP.rationale);
        this.purchaseRequestFormGroup.controls['prType'].setValue("Project");
        var _prItems: PurchaseRequestItemsModel[] = [];
        this.selectedPP.items.forEach((item) => {
          _prItems.push(new PurchaseRequestItemsModel(
            "",
            item.itemId,
            item.description,
            "",
            "",
            item.quantity,
            item.quantity,
            item.quantity,
            item.uom,
            item.cost,
            item.total,
            item.remarks,
            "",
            0
          ))
        });
        this.itemDataSource = new MatTableDataSource<PurchaseRequestItemsModel>(_prItems);
        
        //this.selectedSOF = this.selectedPP.sof;
        var ids: number[] = [];
        this.selectedPP.sof.forEach((sof) => {
          ids.push(sof.sofId);
        });

        if (ids.length > 0) {
          this.httpRequest.getSourceOfFundByIds(ids).subscribe((result) => {
            if (result.statusCode == 201) {
              this.selectedSOF = result.data;
            }
          });
        } else {
          this.notifService.showNotification(NotificationType.error, "Cannot load items in this transaction. No Source Of Fund.");
        }
      }
    });
  }

  deptSelectedValue(event: MatSelectChange) {
    if (this.deptSelected.text != event.source.triggerValue) {
      this.selectedSOF = [];
    }
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
        // this.receivedById = result.employee.employee_id;
        // this.receivedByName = result.employee.employee_name;
      }
    });
  }

  browseAPP() {
    const dialogRef = this.dialog.open(AppSelectionDialogComponent, {
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
        this.purchaseRequestFormGroup.controls['sourceOfFund'].setValue(result.sof);
        this.selectedSOF = result.acc;
        this.itemDataSource.data = this.formatPRItems(result.items);

        this.isAPPSelected = true;
        this.refreshTable();
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
    })
    var _itemsTemp: PurchaseRequestItemsModel[] = [];
    this.selectedSOF.forEach((_sof) => {
      var _sItems: PurchaseRequestItemsModel[] = _items.filter(_itm => _itm.accId == _sof.id);
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

  refreshTable() {
    let cloned = this.itemDataSource.data.slice();
    this.itemDataSource.data = cloned;
  }

  public calculateTotal() {
    return this.itemDataSource?.data?.reduce((accum, curr) =>  curr.itemId != '' ? accum + curr.total : accum, 0);
  }

  addItem() {
    if (this.selectedSOF.length == 0) {
      this.notifService.showNotification(NotificationType.error, "Please select Source of Fund!");
      return;
    }

    const dialogRef = this.dialog.open(PrItemDetailsDialogComponent, {
      data: {
        selectedFund: this.selectedSOF,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var _iTemp: PurchaseRequestItemsModel[] = this.itemDataSource.data;
        _iTemp.push(result);
        this.itemDataSource.data = this.formatPRItems(_iTemp);
        this.refreshTable();
      }
    });
  }

  editItem(index: number) {
    var selectedItemx: PurchaseRequestItemsModel;
    selectedItemx = this.itemDataSource.data[index];
    const dialogRef = this.dialog.open(PrItemDetailsDialogComponent, {
      data: {
        selectedItem: selectedItemx,
        selectedFund: this.selectedSOF,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var _iTemp: PurchaseRequestItemsModel[] = this.itemDataSource.data;
        _iTemp.splice(index, 1, result);
        this.itemDataSource.data = this.formatPRItems(_iTemp);
        this.refreshTable();
      }
    });
  }

  removeItem(index: number) {
    var _iTemp: PurchaseRequestItemsModel[] = this.itemDataSource.data;
    _iTemp.splice(index, 1);
    this.itemDataSource.data = this.formatPRItems(_iTemp);
    this.refreshTable();
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  onFileSelected(event: any) {
    this.fileName = "";
    this.filesSelected = event.target.files;

    if (this.filesSelected.length) {
      if (this.filesSelected.length > 1) {
        for (let i = 0; i < this.filesSelected.length; i ++) {
          if (this.fileName.length < 50) {
            this.fileName += this.filesSelected[i].name.substring(0, 7).trim();
            var fileExt = this.filesSelected[i].name.split(".");
            this.fileName += "..." + fileExt[fileExt.length-1];
            if (i < this.filesSelected.length-1) {
              this.fileName += ", ";
            }
          }
        }
      } else {
        this.fileName = this.filesSelected[0].name;
      }
    }
  }
}
