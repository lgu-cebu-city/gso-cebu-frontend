// ignore_for_file: unnecessary_new, prefer_collection_literals

export class PurchaseRequestIssuanceItemsModel {
  constructor(
    public id: string,
    public prId: string,
    public poId: string,
    public prNo: string,
    public poNo: string,
    public itemId: string,
    public description: string,
    public specification: string,
    public uom: string,
    public cost: number,
    public quantity: number,
    public typeId: string,
  ) {
    return {
      id,
      prId,
      poId,
      prNo,
      poNo,
      itemId,
      description,
      specification,
      uom,
      cost,
      quantity,
      typeId,
    }
  }
}