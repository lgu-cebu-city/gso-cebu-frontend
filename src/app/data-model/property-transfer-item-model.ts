// ignore_for_file: unnecessary_new, prefer_collection_literals

import { Optional } from "@angular/core";
import { PropertyTransferItemBatchModel } from "./property-transfer-item-batch-model";

export class PropertyTransferItemModel {
  constructor(
    public id: string,
    public itemId: string,
    public itemCode: string,
    public unitId: string,
    public uom: string,
    public description: string,
    public requestedQty: number,
    public issuedUnit: string,
    public issuedQty: number,
    public lotNo: string,
    public genericId: string,
    public groupId: string,
    public price: number,
    public remarks: string,
    @Optional() public itemsDetails?: PropertyTransferItemBatchModel[]
  ) {
    return {
      id,
      itemId,
      itemCode,
      unitId,
      uom,
      description,
      requestedQty,
      issuedUnit,
      issuedQty,
      lotNo,
      genericId,
      groupId,
      price,
      remarks,
      itemsDetails
    }
  }
}