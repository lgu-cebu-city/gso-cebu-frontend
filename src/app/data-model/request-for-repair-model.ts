// ignore_for_file: unnecessary_new, prefer_collection_literals

import { RequestForRepairItemModel } from "./request-for-repair-item-model";

export class RequestForRepairModel {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public departmentId: string,
    public departmentName: string,
    public reason: string,
    public remarks: string,
    public items: RequestForRepairItemModel[],
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      departmentId,
      departmentName,
      reason,
      remarks,
      items,
    }
  }
}