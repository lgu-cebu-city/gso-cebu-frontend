import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { WasteMaterialReportInspectionCertificateModel } from 'src/app/data-model/waste-material-report-inspection-certificate-model';
import { WasteMaterialReportItemModel } from 'src/app/data-model/waste-material-report-item-model';
import { WasteMaterialReportModel } from 'src/app/data-model/waste-material-report-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-waste-material-report-print',
  templateUrl: './waste-material-report-print.component.html',
  styleUrls: ['./waste-material-report-print.component.css']
})
export class WasteMaterialReportPrintComponent implements OnInit {
  @Input() wmrData: WasteMaterialReportModel;
  @Input() wmrItemsData: WasteMaterialReportItemModel[];
  displayedColumnsItemDetails: string[] = ['itemCode', 'uom', 'quantity', 'description', 'orNo', 'orDate', 'amount'];
  datepipe: DatePipe = new DatePipe('en-US');
  gsoOfficer: string;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initSignatory();
  }

  initSignatory() {
    var _xdept = this.authService.listDepartment.find(d => d.id == environment.gsoDeptId);
    if (_xdept) {
      var _xEmp = this.authService.listEmployee.find(e => e.id == _xdept.emp_head);
      this.gsoOfficer = _xEmp?.Fullname || "";
    }
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MM/dd/yyyy') || "";
  }

  certInspStatus(_status: string): WasteMaterialReportInspectionCertificateModel {
    var retVal = new WasteMaterialReportInspectionCertificateModel();
    var data = this.wmrData.inspectionCertificate.find(i => i.description == _status);
    if (data) {
      retVal = data;
    }
    return retVal;
  }

}
