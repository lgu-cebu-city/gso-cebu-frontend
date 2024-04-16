// ignore_for_file: unnecessary_new, prefer_collection_literals

import { InventoryCustodianSlipItemsModel } from "./inventory-custodian-slip-items-model";

export class InventoryCustodianSlipModel {
  constructor(
    public id: string,
    public icsNo: string,
    public icsDate: Date,
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
    public receivedFromId: string,
    public receivedFromName: string,
    public receivedById: string,
    public receivedByName: string,
    public items: InventoryCustodianSlipItemsModel[],
  ) {
    return {
      id,
      icsNo,
      icsDate,
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
      receivedFromId,
      receivedFromName,
      receivedById,
      receivedByName,
      items
    }
  }
}