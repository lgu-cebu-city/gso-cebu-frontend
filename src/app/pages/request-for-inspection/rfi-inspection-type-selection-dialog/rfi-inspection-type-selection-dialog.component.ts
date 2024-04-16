import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RequestForInspectionTypeModel } from 'src/app/data-model/request-for-inspection-type-model';
import { DialogData, RequestForInspectionComponent } from '../request-for-inspection.component';

const inspectionType: {value: string}[] = [
  { value: "I.T. EQUIPMENT" },
  { value: "AIR CONDITIONING UNIT" },
  { value: "PLUMBING" },
  { value: "ELECTRICAL" },
  { value: "OFFICE BUILDING" },
  { value: "LABORATORY AND MEDICAL EQUIPMENT" },
  { value: "OFFICE EQUIPMENT" },
  { value: "FURNITURE AND FIXTURE" },
  { value: "OTHERS" },
];

@Component({
  selector: 'app-rfi-inspection-type-selection-dialog',
  templateUrl: './rfi-inspection-type-selection-dialog.component.html',
  styleUrls: ['./rfi-inspection-type-selection-dialog.component.scss']
})
export class RfiInspectionTypeSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['check', 'inspectionType'];
  datasource = new MatTableDataSource<{ value: string }>(inspectionType);
  selection = new SelectionModel<{ value: string }>(true, []);

  constructor(
    private dialogRef: MatDialogRef<RequestForInspectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    this.datasource.data.forEach(row => {
      if (this.data.selectedType.findIndex(x => x.type == row.value) >= 0) {
        this.selection.select(row);
      }
    });
  }

  addType() {
    var retType: RequestForInspectionTypeModel[] = [];
    this.selection.selected.forEach((type) => {
      retType.push(new RequestForInspectionTypeModel("", type.value));
    });

    this.dialogRef.close(
      {
        retType
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
