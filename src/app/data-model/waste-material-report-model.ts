// ignore_for_file: unnecessary_new, prefer_collection_literals

import { WasteMaterialReportItemModel } from "./waste-material-report-item-model";
import { WasteMaterialReportInspectionCertificateModel } from "./waste-material-report-inspection-certificate-model";

export class WasteMaterialReportModel {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public departmentId: string,
    public departmentName: string,
    public placeOfStorage: string,
    public inspOfficerId: string,
    public inspOfficerName: string,
    public witnessId: string,
    public witnessName: string,
    public fund: string,
    public remarks: string,
    public items: WasteMaterialReportItemModel[],
    public inspectionCertificate: WasteMaterialReportInspectionCertificateModel[],
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      departmentId,
      departmentName,
      placeOfStorage,
      inspOfficerId,
      inspOfficerName,
      witnessId,
      witnessName,
      fund,
      remarks,
      items,
      inspectionCertificate,
    }
  }
}