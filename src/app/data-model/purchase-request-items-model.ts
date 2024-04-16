// ignore_for_file: unnecessary_new, prefer_collection_literals

export class PurchaseRequestItemsModel {
  constructor(
    public id?: string,
    public itemId: string = "",
    public description: string = "",
    public specification: string = "",
    public typeId: string = "",
    public quantity: number = 0,
    public dbmQty?: number,
    public callOutQty?: number,
    public uom: string = "",
    public cost: number = 0,
    public total: number = 0,
    public remarks: string = "",
    public consPrId?: string,
    public appId?: number,
    public accId?: number,
    public prQtr?: string,
  ) {
    return {
      id,
      itemId,
      description,
      specification,
      typeId,
      quantity,
      dbmQty,
      callOutQty,
      uom,
      cost,
      total,
      remarks,
      consPrId,
      appId,
      accId,
      prQtr,
    }
  }
}