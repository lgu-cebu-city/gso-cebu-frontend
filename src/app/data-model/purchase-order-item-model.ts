// ignore_for_file: unnecessary_new, prefer_collection_literals

import { PurchaseOrderItemDRModel } from "./purchase-order-item-dr-model";

export class PurchaseOrderItemModel {
  constructor(
    public id: string,
    public itemId: string,
    public description: string,
    public specification: string,
    public uom: string,
    public quantity: number,
    public cost: number,
    public total: number,
    public remarks: string,
    public typeId: string,
    public dr: PurchaseOrderItemDRModel[] = [],
    public drActual: PurchaseOrderItemDRModel[] = [],
    public isExpanded?: boolean,
  ) {
    return {
      id,
      itemId,
      description,
      specification,
      uom,
      quantity,
      cost,
      total,
      remarks,
      typeId,
      dr,
      drActual
    }
  }
}