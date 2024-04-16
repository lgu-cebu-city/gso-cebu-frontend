// ignore_for_file: unnecessary_new, prefer_collection_literals

export class WasteMaterialReportItemModel {
  constructor(
    public id: string,
    public itemCode: string,
    public quantity: number,
    public itemId: string,
    public description: string,
    public uom: string,
    public refId: string,
    public refNo: string,
    public refType: string,
    public orNo: string,
    public orDate: Date,
    public amount: number,
    public dateAcquired: Date,
  ) {
    return {
      id,
      itemCode,
      quantity,
      itemId,
      description,
      uom,
      refId,
      refNo,
      refType,
      orNo,
      orDate,
      amount,
      dateAcquired,
    }
  }
}