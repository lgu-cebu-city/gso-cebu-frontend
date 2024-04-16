// ignore_for_file: unnecessary_new, prefer_collection_literals

import { RequestForInspectionItemModel } from "./request-for-inspection-item-model";
import { RequestForInspectionTypeModel } from "./request-for-inspection-type-model";

export class RequestForInspectionModel {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public departmentId: string,
    public departmentName: string,
    public transactionType: string,
    public remarks: string,
    public actionTaken: string,
    public items: RequestForInspectionItemModel[],
    public type: RequestForInspectionTypeModel[],
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      departmentId,
      departmentName,
      transactionType,
      remarks,
      actionTaken,
      items,
      type,
    }
  }
}