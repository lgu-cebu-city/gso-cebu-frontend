// ignore_for_file: unnecessary_new, prefer_collection_literals

import { InventoryReportDetailsModel } from "./inventory-report-details-model";

export class InventoryPropertyModel {
  constructor(
    public itemCode: string,
    public description: string,
    public brand: string,
    public serialNo: string,
    public model: string,
    public uom: string,
    public type: string,
    public group: string,
  ) {
    return {
      itemCode,
      description,
      brand,
      serialNo,
      model,
      uom,
      type,
      group,
    }
  }
}