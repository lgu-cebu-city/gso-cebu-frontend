// ignore_for_file: unnecessary_new, prefer_collection_literals

export class PurchaseOrderItemDRModel {
  constructor(
    public id: string,
    public poItemId: string,
    public referenceNo: string,
    public referenceDate: Date,
    public invoiceNo: string,
    public invoiceDate: Date,
    public receivedQuantity: number,
    public balance: number,
    public itemId: string,
    public description: string,
    public brandId: string,
    public brand: string,
    public uom: string,
    public price: number,
  ) {
    return {
      id,
      poItemId,
      referenceNo,
      referenceDate,
      invoiceNo,
      invoiceDate,
      receivedQuantity,
      balance,
      itemId,
      description,
      brandId,
      brand,
      uom,
      price,
    }
  }
}