// ignore_for_file: unnecessary_new, prefer_collection_literals

export class ProjectProposalItemsModel {
  constructor(
    public itemId: string = "",
    public description: string = "",
    public type: string = "",
    public quantity: number = 0,
    public uom: string = "",
    public cost: number = 0,
    public total: number = 0,
    public remarks: string = "",
  ) {
    return {
      itemId,
      description,
      type,
      quantity,
      uom,
      cost,
      total,
      remarks
    }
  }
}