// ignore_for_file: unnecessary_new, prefer_collection_literals

import { RequisitionAndIssuanceItemModel } from "./requisition-and-issuance-item-model";

export class RequisitionAndIssuanceModel {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public saiNo: string,
    public saiDate: Date,
    public division: string,
    public departmentId: string,
    public departmentName: string,
    public purpose: string,
    public issuanceType: string,
    public transactionType: string,
    public transactionStatus: string,
    public entryByDepartment: string,
    public entryByUser: string,
    public items: RequisitionAndIssuanceItemModel[]
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      saiNo,
      saiDate,
      division,
      departmentId,
      departmentName,
      purpose,
      issuanceType,
      transactionType,
      transactionStatus,
      entryByDepartment,
      entryByUser,
      items
    }
  }
}