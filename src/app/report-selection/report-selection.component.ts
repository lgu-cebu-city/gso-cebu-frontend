import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-selection',
  templateUrl: './report-selection.component.html',
  styleUrls: ['./report-selection.component.css']
})
export class ReportSelectionComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ReportSelectionComponent>,
  ) { }

  ngOnInit(): void {
  }

  selectPrint(selection: string) {
    this.dialogRef.close(
      {
        data: selection
      }
    );
  }

}
