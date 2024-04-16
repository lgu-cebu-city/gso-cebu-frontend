// ignore_for_file: unnecessary_new, prefer_collection_literals

export class InventoryCustodianSlipSubItemsModel {
  constructor(
    public id: string = "",
    public itemId: string = "",
    public description: string = "",
    public uom: string = "",
    public quantity: number = 0,
    public serialNo: string = "",
    public model: string = ""
  ) {
    return {
      id,
      itemId,
      description,
      uom,
      quantity,
      serialNo,
      model
    }
  }
}