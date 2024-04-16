// ignore_for_file: unnecessary_new, prefer_collection_literals

import { PropertyAccountabilityItemModel } from "./property-accountability-item-model";

export class PropertyAccountabilityModel {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public propReqId: string,
    public requestorId: string,
    public requestorName: string,
    public approvedById: string,
    public approvedByName: string,
    public dateFrom: Date,
    public dateTo: Date,
    public requestType: string,
    public purpose: string,
    public remarks: string,
    public items: PropertyAccountabilityItemModel[],
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      propReqId,
      requestorId,
      requestorName,
      approvedById,
      approvedByName,
      dateFrom,
      dateTo,
      requestType,
      purpose,
      remarks,
      items,
    }
  }
}