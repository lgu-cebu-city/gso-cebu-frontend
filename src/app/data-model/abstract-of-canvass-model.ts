// ignore_for_file: unnecessary_new, prefer_collection_literals

import { AbstractOfCanvassSupplierModel } from "./abstract-of-canvass-supplier-model";

export class AbstractOfCanvassModel {
  constructor(
    public id: string,
    public rfqId: string,
    public rfqNo: string,
    public transactionNo: string,
    public transactionDate: Date,
    public supplyDescription: string,
    public remarks: string,
    public bacChairman: string = "",
    public bacVChairman: string = "",
    public bacMember1: string = "",
    public bacMember2: string = "",
    public bacMember3: string = "",
    public bacMember4: string = "",
    public supplier: AbstractOfCanvassSupplierModel[]
  ) {
    return {
      id,
      rfqId,
      rfqNo,
      transactionNo,
      transactionDate,
      supplyDescription,
      remarks,
      bacChairman,
      bacVChairman,
      bacMember1,
      bacMember2,
      bacMember3,
      bacMember4,
      supplier
    }
  }
}