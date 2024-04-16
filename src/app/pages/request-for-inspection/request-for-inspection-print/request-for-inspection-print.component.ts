import { Component, Input, OnInit } from '@angular/core';
import { RequestForInspectionItemModel } from 'src/app/data-model/request-for-inspection-item-model';
import { RequestForInspectionModel } from 'src/app/data-model/request-for-inspection-model';

@Component({
  selector: 'app-request-for-inspection-print',
  templateUrl: './request-for-inspection-print.component.html',
  styleUrls: ['./request-for-inspection-print.component.css']
})
export class RequestForInspectionPrintComponent implements OnInit {
  @Input() rfiData: RequestForInspectionModel;
  @Input() rfiItemsData: RequestForInspectionItemModel[];
  displayedColumnsItemDetails: string[] = ['itemNo', 'description', 'areNo', 'issue'];

  constructor() { }

  ngOnInit(): void {
  }

  containType(_type: string): boolean {
    return this.rfiData.type.some(t => t.type == _type);
  }

}
