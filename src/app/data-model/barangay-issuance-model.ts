// ignore_for_file: unnecessary_new, prefer_collection_literals

import { BarangayIssuanceItemModel } from "./barangay-issuance-item-model";

export class BarangayIssuance {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public accountablePersonIdFrom: string,
    public accountablePersonNameFrom: string,
    public accountablePersonDesignationFrom: string,
    public accountablePersonIdTo: string,
    public accountablePersonNameTo: string,
    public accountablePersonDesignationTo: string,
    public approvePersonId: string,
    public approvePersonName: string,
    public approvePersonDesignation: string,
    public releasePersonId: string,
    public releasePersonName: string,
    public releasePersonDesignation: string,
    public remarks: string,
    public entryByDepartment: string,
    public entryByUser: string,
    public items: BarangayIssuanceItemModel[]
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      accountablePersonIdFrom,
      accountablePersonNameFrom,
      accountablePersonDesignationFrom,
      accountablePersonIdTo,
      accountablePersonNameTo,
      accountablePersonDesignationTo,
      approvePersonId,
      approvePersonName,
      approvePersonDesignation,
      releasePersonId,
      releasePersonName,
      releasePersonDesignation,
      remarks,
      entryByDepartment,
      entryByUser,
      items
    }
  }
}