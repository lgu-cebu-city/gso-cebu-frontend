// ignore_for_file: unnecessary_new, prefer_collection_literals

export class AbstractOfCanvassItemModel {
  constructor(
    public id: string,
    public itemId: string,
    public description: string,
    public specification: string,
    public uom: string,
    public quantity: number,
    public typeId: string,
    public price: number,
    public priceRead: number,
    public priceCalculated: number,
    public remarks: string,
    public awarded: boolean = false,
    public approved: boolean = false,
    public total?: number,
  ) {
    return {
      id,
      itemId,
      description,
      specification,
      uom,
      quantity,
      typeId,
      price,
      priceRead,
      priceCalculated,
      remarks,
      awarded,
      approved,
      total
    }
  }
}