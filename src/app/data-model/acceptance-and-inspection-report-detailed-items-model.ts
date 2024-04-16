// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AcceptanceAndInspectionReportSubItemsModel } from "./acceptance-and-inspection-report-sub-items-model";

export class AcceptanceAndInspectionReportDetailedItemsModel {
  constructor(
    public propCode: string,
    public brand: string,
    public model: string,
    public serial: string,
    public subItems: AcceptanceAndInspectionReportSubItemsModel[]
  ) {
    return {
      propCode,
      brand,
      model,
      serial,
      subItems,
    }
  }
}