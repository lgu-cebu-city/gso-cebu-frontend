// ignore_for_file: unnecessary_new, prefer_collection_literals

export class PropertyRequisitionItemModel {
  constructor(
    public id: string,
    public itemCode: string,
    public itemId: string,
    public description: string,
    public uom: string,
    public areId: string,
    public areNo: string,
  ) {
    return {
      id,
      itemCode,
      itemId,
      description,
      uom,
      areId,
      areNo,
    }
  }
}