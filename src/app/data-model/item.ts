// ignore_for_file: unnecessary_new, prefer_collection_literals

import { InventoryMedicineModel } from "./inventory-medicine-model";

export class Item {
  constructor(
    public id: string,
    public code: string,
    public description: string,
    public uom: string,
    public groupId: string,
    public groupdesc: string,
    public typeId: string,
    public typedesc: string,
    public category: string,
    public status: string,
    public quantity: number,
    public price: number,
    public ledger: InventoryMedicineModel[]
  ) {
    return {
      id,
      code,
      description,
      uom,
      groupId,
      groupdesc,
      typeId,
      typedesc,
      category,
      status,
      quantity,
      price,
      ledger
    }
  }
}