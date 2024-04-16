// ignore_for_file: unnecessary_new, prefer_collection_literals

export class RequestForInspectionItemModel {
  constructor(
    public id: string,
    public itemNo: number,
    public itemId: string,
    public description: string,
    public areId: string,
    public areNo: string,
    public issue: string,
    public remarks: string,
  ) {
    return {
      id,
      itemNo,
      itemId,
      description,
      areId,
      areNo,
      issue,
      remarks,
    }
  }
}