// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AcceptanceAndInspectionReportItemsModel } from "./acceptance-and-inspection-report-items-model";

export class AcceptanceAndInspectionReportModel {
  constructor(
    public id: string,
    public referenceNo: string,
    public referenceDate: Date,
    public invoiceNo: string,
    public invoiceDate: Date,
    public prId: string,
    public prNo: string,
    public poId: string,
    public poNo: string,
    public poDate: Date,
    public departmentId: string,
    public departmentName: string,
    public sourceOfFund: string,
    public supplierId: string,
    public supplierName: string,
    public supplierAddress: string,
    public purpose: string,
    public supplyPropCust: string,
    public receivedBy: string,
    public receivedByPosition: string,
    public cto: string,
    public cao: string,
    public cmo: string,
    public it: string,
    public items: AcceptanceAndInspectionReportItemsModel[],
    public itemsView: AcceptanceAndInspectionReportItemsModel[] = [],
    public detailedItem: AcceptanceAndInspectionReportItemsModel[] = []
  ) {
    return {
      id,
      referenceNo,
      referenceDate,
      invoiceNo,
      invoiceDate,
      prId,
      prNo,
      poId,
      poNo,
      poDate,
      departmentId,
      departmentName,
      sourceOfFund,
      supplierId,
      supplierName,
      supplierAddress,
      purpose,
      supplyPropCust,
      receivedBy,
      receivedByPosition,
      cto,
      cao,
      cmo,
      it,
      items,
      itemsView,
      detailedItem
    }
  }
}