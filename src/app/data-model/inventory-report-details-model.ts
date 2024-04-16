// ignore_for_file: unnecessary_new, prefer_collection_literals

export class InventoryReportDetailsModel {
  constructor(
    public departmentId: string,
    public departmentName: string,
    public referenceNo: string,
    public referenceDate: Date,
    public method: string,
    public quantity: number,
    public reportQty: number,
    public unit: string,
    public runningBalance: number
  ) {
    return {
      departmentId,
      departmentName,
      referenceNo,
      referenceDate,
      method,
      quantity,
      reportQty,
      unit,
      runningBalance
    }
  }
}