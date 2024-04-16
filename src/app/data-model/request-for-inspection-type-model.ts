// ignore_for_file: unnecessary_new, prefer_collection_literals

export class RequestForInspectionTypeModel {
  constructor(
    public id: string,
    public type: string,
  ) {
    return {
      id,
      type,
    }
  }
}