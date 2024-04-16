// ignore_for_file: unnecessary_new, prefer_collection_literals

export class AcceptanceAndInspectionReportSubItemsModel {
  constructor(
    public id: string = "",
    public itemId: string = "",
    public description: string = "",
    public uom: string = "",
    public quantity: number = 0,
    public serialNo: string = "",
    public model: string = "",
    public sItemIndex: number = 0,
  ) {
    return {
      id,
      itemId,
      description,
      uom,
      quantity,
      serialNo,
      model,
      sItemIndex,
    }
  }
}