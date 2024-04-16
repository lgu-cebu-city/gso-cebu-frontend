// ignore_for_file: unnecessary_new, prefer_collection_literals

export class PostRepairInspectionItemsModel {
  constructor(
    public id: string,
    public itemId: string,
    public description: string,
    public type: string,
    public uom: string,
    public quantity: number,
    public cost: number,
    public total: number,
    public remarks: string,
    public dateAcquired: Date,
  ) {
    return {
      id,
      itemId,
      description,
      type,
      uom,
      quantity,
      cost,
      total,
      remarks,
      dateAcquired,
    }
  }
}