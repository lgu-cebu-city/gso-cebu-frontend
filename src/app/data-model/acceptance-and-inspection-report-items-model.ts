// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AcceptanceAndInspectionReportDetailedItemsModel } from "./acceptance-and-inspection-report-detailed-items-model";
import { AcceptanceAndInspectionReportSubItemsModel } from "./acceptance-and-inspection-report-sub-items-model";

export class AcceptanceAndInspectionReportItemsModel {
  constructor(
    public id: string = "",
    public poItemId: string = "",
    public groupId: string = "",
    public groupName: string = "",
    public itemId: string = "",
    public description: string = "",
    public specification: string = "",
    public uom: string = "",
    public quantity: number = 0,
    public price: number = 0,
    public receivedQuantity: number = 0,
    public brand: string = "",
    public brandId: string = "",
    public expirationDate: Date = null,
    public lotNo: string = "",
    public remarks: string = "",
    public serialNo: string = "",
    public model: string = "",
    public subItems: AcceptanceAndInspectionReportSubItemsModel[] = [],
    public balance: number = 0,
    public itemNo: string = "",
    public detailedItem: AcceptanceAndInspectionReportDetailedItemsModel[] = [],
  ) {
    return {
      id,
      poItemId,
      groupId,
      groupName,
      itemId,
      description,
      specification,
      uom,
      quantity,
      price,
      receivedQuantity,
      brand,
      brandId,
      expirationDate,
      lotNo,
      remarks,
      serialNo,
      model,
      subItems,
      balance,
      itemNo,
      detailedItem,
    }
  }
}