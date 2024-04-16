// ignore_for_file: unnecessary_new, prefer_collection_literals

import { PreRepairInspectionItemsModel } from "./pre-repair-inspection-items-model";

export class PreRepairInspectionModel {
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
    public acquisationDate: Date = null,
    public acquisationCost: number = 0,
    public lastRepairDate: Date = null,
    public lastRepairNature: string = "",
    public defectComplaints: string = "",
    public workScope: string = "",
    public remarks: string = "",
    public requestedById: string = "",
    public requestedByName: string = "",
    public inspectedBy1Id: string = "",
    public inspectedBy1Name: string = "",
    public inspectedBy2Id: string = "",
    public inspectedBy2Name: string = "",
    public notedById: string = "",
    public notedByName: string = "",
    public items: PreRepairInspectionItemsModel[] = []
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
      acquisationDate,
      acquisationCost,
      lastRepairDate,
      lastRepairNature,
      defectComplaints,
      workScope,
      remarks,
      requestedById,
      requestedByName,
      inspectedBy1Id,
      inspectedBy1Name,
      inspectedBy2Id,
      inspectedBy2Name,
      notedById,
      notedByName,
      items
    }
  }
}