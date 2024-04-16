// ignore_for_file: unnecessary_new, prefer_collection_literals

export class PropertyAccountabilityItemModel {
  constructor(
    public id: string,
    public itemNo: number,
    public itemCode: string,
    public itemId: string,
    public description: string,
    public uom: string,
    public areId: string,
    public areNo: string,
  ) {
    return {
      id,
      itemNo,
      itemCode,
      itemId,
      description,
      uom,
      areId,
      areNo,
    }
  }
}