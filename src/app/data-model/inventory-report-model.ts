// ignore_for_file: unnecessary_new, prefer_collection_literals

import { InventoryReportDetailsModel } from "./inventory-report-details-model";

export class InventoryReportModel {
  constructor(
    public id: string,
    public itemCode: string,
    public description: string,
    public uom: string,
    public category: string,
    public type: string,
    public group: string,
    public receivedQty: number,
    public withdrawnQty: number,
    public returnQty: number,
    public onhandQty: number,
    public details: InventoryReportDetailsModel[]
  ) {
    return {
      id,
      itemCode,
      description,
      uom,
      category,
      type,
      group,
      receivedQty,
      withdrawnQty,
      returnQty,
      onhandQty,
      details
    }
  }
}