// ignore_for_file: unnecessary_new, prefer_collection_literals

import { PropertyRequisitionItemModel } from "./property-requisition-item-model";

export class PropertyRequisitionModel {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public requestorId: string,
    public requestorName: string,
    public preparedById: string,
    public preparedByName: string,
    public dateFrom: Date,
    public dateTo: Date,
    public purpose: string,
    public remarks: string,
    public items: PropertyRequisitionItemModel[],
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      requestorId,
      requestorName,
      preparedById,
      preparedByName,
      dateFrom,
      dateTo,
      purpose,
      remarks,
      items,
    }
  }
}