// ignore_for_file: unnecessary_new, prefer_collection_literals

import { InventoryCustodianSlipSubItemsModel } from "./inventory-custodian-slip-sub-items-model";

export class InventoryCustodianSlipItemsModel {
  constructor(
    public id: string = "",
    public poItemId: string = "",
    public groupId: string = "",
    public groupName: string = "",
    public itemId: string = "",
    public propertyNo: string = "",
    public description: string = "",
    public uom: string = "",
    public quantity: number = 0,
    public price: number = 0,
    public dateAcquired: Date = null,
    public receivedQuantity: number = 0,
    public brand: string = "",
    public brandId: string = "",
    public expirationDate: Date = null,
    public lotNo: string = "",
    public remarks: string = "",
    public serialNo: string = "",
    public model: string = "",
    public iarId: string = "",
    public iarItemId: string = "",
    public subItems: InventoryCustodianSlipSubItemsModel[] = []
  ) {
    return {
      id,
      poItemId,
      groupId,
      groupName,
      itemId,
      propertyNo,
      description,
      uom,
      quantity,
      price,
      dateAcquired,
      receivedQuantity,
      brand,
      brandId,
      expirationDate,
      lotNo,
      remarks,
      serialNo,
      model,
      iarId,
      iarItemId,
      subItems
    }
  }
}