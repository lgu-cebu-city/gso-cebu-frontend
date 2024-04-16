// ignore_for_file: unnecessary_new, prefer_collection_literals

export class RequestQuotationItemsModel {
  constructor(
    public id?: string,
    public itemId: string = "",
    public description: string = "",
    public specification: string = "",
    public quantity: number = 0,
    public uom: string = "",
    public cost: number = 0,
    public total: number = 0,
    public remarks: string = "",
    public typeId: string = "",
  ) {
    return {
      id,
      itemId,
      description,
      specification,
      quantity,
      uom,
      cost,
      total,
      remarks,
      typeId,
    }
  }
}