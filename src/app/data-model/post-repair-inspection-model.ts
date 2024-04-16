// ignore_for_file: unnecessary_new, prefer_collection_literals

import { PreRepairInspectionItemsModel } from "./pre-repair-inspection-items-model";

export class PostRepairInspectionModel {
  constructor(
    public id: string = "",
    public transactionNo: string = "",
    public transactionDate: Date = new Date,
    public vehicleName: string = "",
    public vehicleType: string = "",
    public plateNo: string = "",
    public brandModel: string = "",
    public engineNo: string = "",
    public chassisNo: string = "",
    public departmentId: string = "",
    public departmentName: string = "",
    public divisionId: string = "",
    public divisionName: string = "",
    public jobDescription: string = "",
    public remarks: string = "",
    public signatory1Id: string = "",
    public signatory1Name: string = "",
    public signatory2Id: string = "",
    public signatory2Name: string = "",
    public acceptedById: string = "",
    public acceptedByName: string = "",
    public items: PreRepairInspectionItemsModel[] = [],
    public itemsForWaste: PreRepairInspectionItemsModel[] = []
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      vehicleName,
      vehicleType,
      plateNo,
      brandModel,
      engineNo,
      chassisNo,
      departmentId,
      departmentName,
      divisionId,
      divisionName,
      jobDescription,
      remarks,
      signatory1Id,
      signatory1Name,
      signatory2Id,
      signatory2Name,
      acceptedById,
      acceptedByName,
      items,
      itemsForWaste
    }
  }
}