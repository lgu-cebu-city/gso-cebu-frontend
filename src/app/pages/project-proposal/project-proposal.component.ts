import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { Accounts } from 'src/app/data-model/Accounts';
import { Department } from 'src/app/data-model/department';
import { FundCategory } from 'src/app/data-model/fund-category';
import { FundListDialogComponent } from './fund-list-dialog/fund-list-dialog.component';
import { ItemDetailsDialogComponent } from './item-details-dialog/item-details-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { ProjectProposalModel } from '../../data-model/project-proposal-model';
import { ProjectProposalSOFModel } from '../../data-model/project-proposal-sof-model';
import { ProjectProposalItemsModel } from '../../data-model/project-proposal-items-model';
import { SOF } from 'src/app/data-model/sof';
import { Barangay } from 'src/app/data-model/barangay';
import { environment } from 'src/environments/environment';

export interface DialogData {
  selectedData: ProjectProposalModel;
  selectedItem: ProjectProposalItemsModel;
  selectedTypeId: string;
  sofData: Accounts[];
  selectedFund: Accounts[];
  deptList: Department[];
  catList: FundCategory[];
  sofList: SOF[];
  defaultDept: "";
  itemCategory: string;
  transType: string;
  itemType: string;
}

@Component({
  selector: 'app-project-proposal',
  templateUrl: './project-proposal.component.html',
  styleUrls: ['./project-proposal.component.scss']
})
export class ProjectProposalComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  projectProposalFormGroup: FormGroup;
  currentRowControl = new FormControl(0);
  itemDisplayedColumns: string[] = ['type', 'description', 'quantity', 'unitMeasure', 'unitCost', 'totalCost', 'remarks', 'action'];
  itemDataSource = new MatTableDataSource<ProjectProposalItemsModel>([]);
  nextIndex: number = 0
  dataSource: Accounts[] = [];
  selectedSOF: Accounts[] = [];
  departmentSelection: Department[] = [];
  barangaySelection: Barangay[] = [];
  fundCategorySelection: FundCategory[] = [];
  sofSelection: SOF[] = [];
  deptSelected: { value: string; text: string } = {value: "", text: ""};
  brgySelected: { value: string; text: string } = {value: "", text: ""};
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  ppId: string = "";
  btnSaveText: string = "Save";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public router: Router, 
    private route: ActivatedRoute,
    private notifService : NotificationService,
    public dialog: MatDialog,
    private dialogRefx: MatDialogRef<ProjectProposalComponent>,
    private httpRequest: HttpRequestService
  ) { }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.loadDepartment();
    await this.loadBarangay();
    this.loadFundCategory();
    this.loadSOF();
    this.getTransactionNo();
    this.initParam();
  }

  initParam() {
    if (this.data) {
      this.initData(this.data.selectedData);
    }
    this.route.params.subscribe((param: Params) =>  {
      if (param['id']) {
        var paramId = param['id'];
        this.removeParam();
        this.httpRequest.getProjectProposalById(paramId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.initData(result.data);
          }
        });
      }
    });
  }

  initData(data: ProjectProposalModel) {
    this.ppId = data.id;
    this.projectProposalFormGroup.controls['refNo'].setValue(data.referenceNo);
    this.projectProposalFormGroup.controls['refDate'].setValue(data.referenceDate);
    this.projectProposalFormGroup.controls['projTitle'].setValue(data.projectTitle);
    this.projectProposalFormGroup.controls['projLocation'].setValue(data.projectLocation);
    this.projectProposalFormGroup.controls['projBrgy'].setValue(data.projLocBarangay);
    this.projectProposalFormGroup.controls['projDesc'].setValue(data.description);
    this.projectProposalFormGroup.controls['projSof'].setValue(data.sourceOfFund);
    this.projectProposalFormGroup.controls['projStartDate'].setValue(data.projectStartDate);
    this.projectProposalFormGroup.controls['projDuration'].setValue(data.projectDuration);
    this.projectProposalFormGroup.controls['projType'].setValue(data.projectType);
    this.projectProposalFormGroup.controls['projCost'].setValue(data.projectCost);
    this.projectProposalFormGroup.controls['rationale'].setValue(data.rationale);
    this.deptSelected.value = data.departmentId.toString();
    this.deptSelected.text = data.departmentName;
    this.brgySelected.value = this.barangaySelection.find(b => b.name = data.projLocBarangay).id;
    this.brgySelected.text = data.projLocBarangay;
    data.sof.forEach((sof) => {
      this.httpRequest.getSourceOfFundById(sof.sofId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.selectedSOF.push(result.data);
        }
      });
    });
    data.items.forEach((item) => {
      this.itemDataSource.data.push(item);
      this.refreshTable();
    });
    this.btnSaveText = "Update";
  }

  initForm() {
    this.projectProposalFormGroup = new FormGroup({
      refNo: new FormControl("", [Validators.required]),
      refDate: new FormControl(new Date, [Validators.required]),
      projTitle: new FormControl("", [Validators.required]),
      projLocation: new FormControl("", [Validators.required]),
      projBrgy: new FormControl("", [Validators.required]),
      projDesc: new FormControl("", [Validators.required]),
      projSof: new FormControl("", [Validators.required]),
      projStartDate: new FormControl(new Date, [Validators.required]),
      projDuration: new FormControl("", [Validators.required]),
      projType: new FormControl("", [Validators.required]),
      projCost: new FormControl(0, [Validators.required]),
      rationale: new FormControl("", [Validators.required])
    });
  }

  async ngAfterViewInit() {
  }

  getTransactionNo() {
    this.httpRequest.getProjectProposalTransactionNo().subscribe((result) => {
      if (result.statusCode == 200) {
        this.projectProposalFormGroup.controls['refNo'].setValue(result.data[0].transactionNo);
      }
    });
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (!this.deptSelected.value) {
      msg = "Please select Department.";
    }
    if (!this.brgySelected.value) {
      msg = "Please select Barangay.";
    }
    if (this.itemDataSource.data.length == 0) {
      msg = "Please add Item/s.";
    }
    if (this.projectProposalFormGroup.get("projCost")?.value == 0) {
      msg = "Please input project cost."
    }

    return {result: msg == "", message: msg};
  }

  async saveData() {
    var isDataValid = this.isEntryValid();
    if (!isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      return;
    }
    if (!this.projectProposalFormGroup.valid) return;

    var saveSOFList: ProjectProposalSOFModel[] = [];
    var saveItemList: ProjectProposalItemsModel[] = [];
    this.selectedSOF.forEach((sof) => {
      var s = new ProjectProposalSOFModel(
        sof.id,
        sof.description,
        sof.budgetYear,
        sof.amount
      );
      saveSOFList.push(s);
    });
    this.itemDataSource.data.forEach((item) => {
      saveItemList.push(item);
    });

    var data = new ProjectProposalModel(
      "",
      this.projectProposalFormGroup.get("refNo")?.value,
      this.projectProposalFormGroup.get("refDate")?.value,
      this.deptSelected.value,
      this.deptSelected.text,
      this.projectProposalFormGroup.get("projTitle")?.value,
      this.projectProposalFormGroup.get("projLocation")?.value,
      this.brgySelected.text,
      this.projectProposalFormGroup.get("projDesc")?.value,
      this.projectProposalFormGroup.get("rationale")?.value,
      this.projectProposalFormGroup.get("projStartDate")?.value,
      this.projectProposalFormGroup.get("projDuration")?.value,
      this.projectProposalFormGroup.get("projType")?.value,
      this.projectProposalFormGroup.get("projCost")?.value,
      this.projectProposalFormGroup.get("projSof")?.value,
      saveSOFList,
      saveItemList
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.saveProjectProposal(data).subscribe((result) => {
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
      this.httpRequest.updateProjectProposal(this.ppId, data).subscribe((result) => {
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
    this.projectProposalFormGroup.reset();
    Object.keys(this.projectProposalFormGroup.controls).forEach(key => {
      this.projectProposalFormGroup.get(key)?.setErrors(null) ;
    });
    this.itemDataSource = new MatTableDataSource<ProjectProposalItemsModel>([]);
    this.projectProposalFormGroup.controls['refDate'].setValue(new Date);
    this.projectProposalFormGroup.controls['projStartDate'].setValue(new Date);
    this.projectProposalFormGroup.controls['projCost'].setValue(0);
    this.deptSelected = {value: "", text: ""};
    this.brgySelected = {value: "", text: ""};
    this.selectedSOF = [];
    this.ppId = "";
    this.btnSaveText = "Save";
    this.getTransactionNo();
    this.removeParam();
  }

  removeParam() {
    if (this.envFirstLoad == "Entry") {
      this.router.navigateByUrl("/project-proposal");
    }
  }

  gotoList() {
    this.router.navigate(["/project-proposal-list"]);
  }

  selectFund() {
    const dialogRef = this.dialog.open(FundListDialogComponent, {
      data: {
        sofData: this.dataSource, 
        selectedFund: this.selectedSOF,
        deptList: this.departmentSelection,
        catList: this.fundCategorySelection,
        sofList: this.sofSelection,
        defaultDept: this.deptSelected?.text || ""
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deptSelected = result.department;
        this.selectedSOF = result.selectedFund;
        this.projectProposalFormGroup.controls['projSof'].setValue(result.selectedSOF);
      }
    });
  }

  loadBarangay(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpRequest.getBarangayAll().subscribe((result) => {
        if (result.statusCode == 200) {
          this.barangaySelection = result.data;
          resolve(true);
        }
      });
    });
  }

  loadDepartment() {
    this.httpRequest.getDepartmentAll().subscribe((result) => {
      if (result.statusCode == 200) {
        this.departmentSelection = result.data;
      }
    });
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

  addItem() {
    const dialogRef = this.dialog.open(ItemDetailsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemDataSource.data.push(result);
        this.refreshTable();
      }
    });
  }

  editItem(index: number) {
    var selectedItemx: ProjectProposalItemsModel;
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

  brgySelectedValue(event: MatSelectChange) {
    this.brgySelected = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}


