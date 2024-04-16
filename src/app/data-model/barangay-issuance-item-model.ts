// ignore_for_file: unnecessary_new, prefer_collection_literals

import { Optional } from "@angular/core";
import { BarangayIssuanceItemBatchModel } from "./barangay-issuance-item-batch-model";

export class BarangayIssuanceItemModel {
  constructor(
    public id: string,
    public itemId: string,
    public itemCode: string,
    public unitId: string,
    public uom: string,
    public description: string,
    public issuedQty: number,
    public lotNo: string,
    public genericId: string,
    public groupId: string,
    public price: number,
    public remarks: string,
    @Optional() public itemsDetails?: BarangayIssuanceItemBatchModel[]
  ) {
    return {
      id,
      itemId,
      itemCode,
      unitId,
      uom,
      description,
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