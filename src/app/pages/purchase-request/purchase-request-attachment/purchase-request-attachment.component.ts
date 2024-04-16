import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-request-attachment',
  templateUrl: './purchase-request-attachment.component.html',
  styleUrls: ['./purchase-request-attachment.component.css']
})
export class PurchaseRequestAttachmentComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialog.closeAll();
  }

}
