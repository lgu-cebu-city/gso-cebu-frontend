// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AbstractOfCanvassItemModel } from "./abstract-of-canvass-item-model";

export class AbstractOfCanvassSupplierModel {
  constructor(
    public id: string,
    public supplierSeq: string,
    public supplierId: string,
    public supplierName: string,
    public address: string,
    public contactNumber: string,
    public approved: boolean = false,
    public hasPo: boolean = false,
    public items: AbstractOfCanvassItemModel[],
    public isExpanded?: boolean,
  ) {
    return {
      id,
      supplierSeq,
      supplierId,
      supplierName,
      address,
      contactNumber,
      hasPo,
      approved,
      items
    }
  }
}