// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AcceptanceAndInspectionReportSubItemsModel } from "./acceptance-and-inspection-report-sub-items-model";

export class AreItemsViewModel {
  constructor(
    public areId: string = "",
    public parNo: string = "",
    public parDate: Date = new Date(),
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
    public subItems: AcceptanceAndInspectionReportSubItemsModel[] = [],
  ) {
    return {
      areId,
      parNo,
      parDate,
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
      subItems,
    }
  }
}