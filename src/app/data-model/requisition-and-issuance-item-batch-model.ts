// ignore_for_file: unnecessary_new, prefer_collection_literals

export class RequisitionAndIssuanceItemBatchModel {
  constructor(
    public id: string,
    public itemId: string,
    public batchNo: string,
    public expirationDate: Date,
    public quantity: number,
    public remarks: string
  ) {
    return {
      id,
      itemId,
      batchNo,
      expirationDate,
      quantity,
      remarks
    }
  }
}