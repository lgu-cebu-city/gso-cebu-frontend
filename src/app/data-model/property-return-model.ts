// ignore_for_file: unnecessary_new, prefer_collection_literals

import { PropertyReturnItemModel } from "./property-return-item-model";

export class PropertyReturnModel {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public propAccId: string,
    public requestorId: string,
    public requestorName: string,
    public receivedById: string,
    public receivedByName: string,
    public processedById: string,
    public processedByName: string,
    public returnStatus: string,
    public remarks: string,
    public items: PropertyReturnItemModel[],
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      propAccId,
      requestorId,
      requestorName,
      receivedById,
      receivedByName,
      processedById,
      processedByName,
      returnStatus,
      remarks,
      items,
    }
  }
}