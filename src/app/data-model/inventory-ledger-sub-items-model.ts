// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AcceptanceAndInspectionReportSubItemsModel } from "./acceptance-and-inspection-report-sub-items-model";

export class InventoryLedgerSubItemsModel {
  constructor(
    public refId: string,
    public itemId: string,
    public description: string,
    public uom: string,
    public quantity: number,
    public serialNo: string,
    public model: string,
    public itemNo: string,
    public remarks: string,
  ) {
    return {
      refId,
      itemId,
      description,
      uom,
      quantity,
      serialNo,
      model,
      itemNo,
      remarks,
    }
  }
}