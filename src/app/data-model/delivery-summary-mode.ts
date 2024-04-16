// ignore_for_file: unnecessary_new, prefer_collection_literals

export class DeliverySummaryModel {
  constructor(
    public poNo: string,
    public poDate: Date,
    public canvassNo: string,
    public prNo: string,
    public supplierName: string,
    public supplierContactNo: string,
    public invoiceNo: string,
    public invoiceDate: Date,
    public deliveryTerm: string,
    public description: string,
    public uom: string,
    public quantity: number,
    public receivedQty: number,
    public balance: number,
    public status: string,
  ) {
    return {
      poNo,
      poDate,
      canvassNo,
      prNo,
      supplierName,
      supplierContactNo,
      invoiceNo,
      invoiceDate,
      deliveryTerm,
      description,
      uom,
      quantity,
      receivedQty,
      balance,
      status,
    }
  }
}