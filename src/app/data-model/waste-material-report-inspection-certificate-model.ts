// ignore_for_file: unnecessary_new, prefer_collection_literals

export class WasteMaterialReportInspectionCertificateModel {
  constructor(
    public id: string = "",
    public quantity: number = 0,
    public description: string = "",
    public transferTo: string = "",
  ) {
    return {
      id,
      quantity,
      description,
      transferTo
    }
  }
}