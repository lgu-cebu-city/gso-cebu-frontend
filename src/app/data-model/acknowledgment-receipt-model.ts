// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AcknowledgementReceiptItemsModel } from "./acknowledgment-receipt-items-model";

export class AcknowledgementReceiptModel {
  constructor(
    public id: string,
    public parNo: string,
    public parDate: Date,
    public departmentId: string,
    public departmentName: string,
    public fundCluster: string,
    public accountType: string,
    public prNo: string,
    public poNo: string,
    public location: string,
    public supplierName: string,
    public deliveryDate: Date,
    public remarks: string,
    public receivedById: string,
    public receivedByName: string,
    public issuedById: string,
    public issuedByName: string,
    public items: AcknowledgementReceiptItemsModel[],
  ) {
    return {
      id,
      parNo,
      parDate,
      departmentId,
      departmentName,
      fundCluster,
      accountType,
      prNo,
      poNo,
      location,
      supplierName,
      deliveryDate,
      remarks,
      receivedById,
      receivedByName,
      issuedById,
      issuedByName,
      items
    }
  }
}