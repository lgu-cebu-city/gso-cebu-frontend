import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Group } from 'src/app/data-model/group';
import { UnitConversion } from 'src/app/data-model/unit-conversion';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { DialogData } from '../../requisition-slip/requisition-slip.component';
import { RisItemDetailsDialogComponent } from '../../requisition-slip/ris-item-details-dialog/ris-item-details-dialog.component';

@Component({
  selector: 'app-unit-selection-dialog',
  templateUrl: './unit-selection-dialog.component.html',
  styleUrls: ['./unit-selection-dialog.component.css']
})
export class UnitSelectionDialogComponent implements OnInit {
  formGroup: FormGroup;
  displayedColumns: string[] = ['unit1', 'quantity1', 'unit2', 'quantity2', 'unit3', 'quantity3', 'unit4', 'quantity4', 'action'];
  dataSource: MatTableDataSource<UnitConversion> = new MatTableDataSource<UnitConversion>([]);
  isProcessing: boolean = false;
  selectedUnit: UnitConversion;
  groupType: Group[];
  itemType: string = "";

  id: string = "";
  btnSaveText: string = "Save";
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<RisItemDetailsDialogComponent>,
    public router: Router, 
    private notifService: NotificationService,
    private httpRequest: HttpRequestService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadGroupType();
    if (this.data.itemType) {
      this.itemType = this.data.itemType;
    }
  }

  async ngAfterViewInit() {
    this.loadData();
  }

  initForm() {
    this.formGroup = new FormGroup({
      unit1: new FormControl("", [Validators.required]),
      quantity1: new FormControl("0", [Validators.required]),
      unit2: new FormControl("", [Validators.required]),
      quantity2: new FormControl("0", [Validators.required]),
      unit3: new FormControl("", [Validators.required]),
      quantity3: new FormControl("0", [Validators.required]),
      unit4: new FormControl("", [Validators.required]),
      quantity4: new FormControl("0", [Validators.required]),
    });
  }

  loadData() {
    if (!this.itemType) {
      return;
    }
    this.httpRequest.getUnitConversionByType(this.itemType).subscribe((result) => {
      if (result.statusCode == 200) {
        this.dataSource = new MatTableDataSource<UnitConversion>(result.data);
        this.selectedUnit = result.data[0];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  loadGroupType() {
    this.httpRequest.getItemGroupWithType().subscribe((result) => {
      if (result.statusCode == 200) {
        this.groupType = result.data;
      }
    });
  }

  rowSelected(row: UnitConversion) {
    this.selectedUnit = row;
  }

  isEntryValid(): {result: boolean, message: string} {
    var msg = "";

    if (!this.formGroup.controls['unit1'].value) {
      msg = "Please input Unit 1";
    }
    if (!this.formGroup.controls['unit2'].value) {
      msg = "Please input Unit 2";
    }
    if (!this.formGroup.controls['unit3'].value) {
      msg = "Please input Unit 3";
    }
    if (!this.formGroup.controls['unit4'].value) {
      msg = "Please input Unit 4";
    }
    if (this.formGroup.controls['quantity1'].value <= 0) {
      msg = "Please input Quantity 1";
    }
    if (this.formGroup.controls['quantity2'].value <= 0) {
      msg = "Please input Quantity 2";
    }
    if (this.formGroup.controls['quantity3'].value <= 0) {
      msg = "Please input Quantity 3";
    }
    if (this.formGroup.controls['quantity4'].value <= 0) {
      msg = "Please input Quantity 4";
    }

    return {result: msg == "", message: msg};
  }

  saveData() {
    if (!this.itemType) {
      this.notifService.showNotification(NotificationType.error, "Please select item group.");
      return;
    }
    if (this.isProcessing) return;
    this.isProcessing = true;
    var isDataValid = this.isEntryValid();
    
    if (this.formGroup.valid && !isDataValid.result) {
      this.notifService.showNotification(NotificationType.error, isDataValid.message);
      this.isProcessing = false;
      return;
    }
    var data: UnitConversion = new UnitConversion(
      this.id,
      this.formGroup.controls['unit1'].value,
      this.formGroup.controls['quantity1'].value,
      this.formGroup.controls['unit2'].value,
      this.formGroup.controls['quantity2'].value,
      this.formGroup.controls['unit3'].value,
      this.formGroup.controls['quantity3'].value,
      this.formGroup.controls['unit4'].value,
      this.formGroup.controls['quantity4'].value,
      this.itemType
    );

    if (this.btnSaveText == "Save") {
      this.httpRequest.addUnitConversion(data).subscribe((result) => {
        this.loadData();
        this.clearData();
        this.notifService.showNotification(NotificationType.success, "Successfully saved!");
      });
    } else if (this.btnSaveText == "Update") {
      this.httpRequest.updateUnitConversion(this.id, data).subscribe((result) => {
        this.loadData();
        this.clearData();
        this.notifService.showNotification(NotificationType.success, "Successfully updated!");
      });
    }
    this.isProcessing = false;
  }

  editData(unit: UnitConversion) {
    this.id = unit.id;
    this.formGroup.controls['unit1'].setValue(unit.unit1);
    this.formGroup.controls['quantity1'].setValue(unit.quantity1);
    this.formGroup.controls['unit2'].setValue(unit.unit2);
    this.formGroup.controls['quantity2'].setValue(unit.quantity2);
    this.formGroup.controls['unit3'].setValue(unit.unit3);
    this.formGroup.controls['quantity3'].setValue(unit.quantity3);
    this.formGroup.controls['unit4'].setValue(unit.unit4);
    this.formGroup.controls['quantity4'].setValue(unit.quantity4);
    this.btnSaveText = "Update";
  }

  deleteData(unit: UnitConversion) {

  }
  
  typeSelectedValue(event: MatSelectChange) {
    this.loadData();
  }

  clearData() {
    this.id = "";
    this.formGroup.reset();
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.setErrors(null) ;
    });
    this.formGroup.controls['quantity1'].setValue(0);
    this.formGroup.controls['quantity2'].setValue(0);
    this.formGroup.controls['quantity3'].setValue(0);
    this.formGroup.controls['quantity4'].setValue(0);
    this.btnSaveText = "Save";
  }

  selectUnit() {
    this.dialogRef.close(
      {
        selectedUnit: this.selectedUnit
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
