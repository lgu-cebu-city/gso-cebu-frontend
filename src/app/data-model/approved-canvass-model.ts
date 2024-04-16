// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AbstractOfCanvassItemModel } from "./abstract-of-canvass-item-model";

export class ApprovedCanvassModel {
  constructor(
    public aoc_id: string = "",
    public rfqId: string = "",
    public rfqNo: string = "",
    public prId: string = "",
    public prNo: string = "",
    public transactionNo: string = "",
    public transactionDate: string = "",
    public supplyDescription: string = "",
    public Status: string = "",
    public id: string = "",
    public supplierId: string = "",
    public supplierName: string = "",
    public address: string = "",
    public contactNumber: string = "",
    public procurementMode: string = "",
    public items: AbstractOfCanvassItemModel[] = []
  ) {
    return {
      aoc_id,
      rfqId,
      rfqNo,
      prId,
      prNo,
      transactionNo,
      transactionDate,
      supplyDescription,
      Status,
      id,
      supplierId,
      supplierName,
      address,
      contactNumber,
      procurementMode,
      items
    }
  }
}