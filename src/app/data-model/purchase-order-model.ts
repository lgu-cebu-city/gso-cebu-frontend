// ignore_for_file: unnecessary_new, prefer_collection_literals

import { PurchaseOrderItemModel } from "./purchase-order-item-model";

export class PurchaseOrderModel {
  constructor(
    public id: string = "",
    public transactionNo: string = "",
    public transactionDate: Date = new Date,
    public canvassId: string = "",
    public canvassNo: string = "",
    public prId: string = "",
    public prNo: string = "",
    public procurementMode: string = "",
    public supplierId: string = "",
    public supplierName: string = "",
    public supplierAddress: string = "",
    public supplierContactNo: string = "",
    public supplierRemarks: string = "",
    public deliveryPlace: string = "",
    public deliveryDate: Date = new Date,
    public deliveryTerm: string = "",
    public paymentTerm: string = "",
    public items: PurchaseOrderItemModel[] = [],
    public poStatus: string = "",
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      canvassId,
      canvassNo,
      prId,
      prNo,
      procurementMode,
      supplierId,
      supplierName,
      supplierAddress,
      supplierContactNo,
      supplierRemarks,
      deliveryPlace,
      deliveryDate,
      deliveryTerm,
      paymentTerm,
      items,
      poStatus,
    }
  }
}