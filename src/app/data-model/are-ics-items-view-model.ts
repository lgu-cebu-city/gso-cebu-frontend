// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AcceptanceAndInspectionReportSubItemsModel } from "./acceptance-and-inspection-report-sub-items-model";

export class AreIcsItemsViewModel {
  constructor(
    public transactionId: string = "",
    public type: string = "",
    public transactionNo: string = "",
    public transactionDate: Date = new Date(),
    public departmentId: string = "",
    public departmentName: string = "",
    public status: string = "",
    public id: string = "",
    public propertyNo: string = "",
    public brandId: string = "",
    public brand: string = "",
    public uom: string = "",
    public price: number = 0,
    public receivedQuantity: string = "",
    public serialNo: string = "",
    public model: string = "",
  ) {
    return {
      transactionId,
      type,
      transactionNo,
      transactionDate,
      departmentId,
      departmentName,
      status,
      id,
      propertyNo,
      brandId,
      brand,
      uom,
      price,
      receivedQuantity,
      serialNo,
      model,
    }
  }
}