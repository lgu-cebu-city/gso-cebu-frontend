// ignore_for_file: unnecessary_new, prefer_collection_literals

import { PropertyTransferItemModel } from "./property-transfer-item-model";

export class PropertyTransfer {
  constructor(
    public id: string,
    public transactionNo: string,
    public transactionDate: Date,
    public risId: string,
    public risNo: string,
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
    public items: PropertyTransferItemModel[]
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      risId,
      risNo,
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
      items
    }
  }
}