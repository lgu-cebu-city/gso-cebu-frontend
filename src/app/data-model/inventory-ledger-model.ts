// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AcceptanceAndInspectionReportSubItemsModel } from "./acceptance-and-inspection-report-sub-items-model";

export class InventoryLedgerModel {
  constructor(
    public refId: string,
    public refType: string,
    public departmentId: string,
    public sectionId: string,
    public groupId: string,
    public itemId: string,
    public brandId: string,
    public description: string,
    public uom: string,
    public quantity: number,
    public price: number,
    public expirationDate: Date,
    public lotNo: string,
    public remarks: string,
    public serialNo: string,
    public model: string,
    public subItems: AcceptanceAndInspectionReportSubItemsModel[]
  ) {
    return {
      refId,
      refType,
      departmentId,
      sectionId,
      groupId,
      itemId,
      brandId,
      description,
      uom,
      quantity,
      price,
      expirationDate,
      lotNo,
      remarks,
      serialNo,
      model,
      subItems,
    }
  }
}