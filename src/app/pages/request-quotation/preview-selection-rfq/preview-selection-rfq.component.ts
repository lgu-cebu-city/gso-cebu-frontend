import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-selection-rfq',
  templateUrl: './preview-selection-rfq.component.html',
  styleUrls: ['./preview-selection-rfq.component.css']
})
export class PreviewSelectionRfqComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<PreviewSelectionRfqComponent>,
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
