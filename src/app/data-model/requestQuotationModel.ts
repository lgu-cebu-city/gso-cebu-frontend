// ignore_for_file: unnecessary_new, prefer_collection_literals

import { RequestQuotationItemsModel } from "./request-quotation-items-model";

export class RequestQuotationModel {
  constructor(
    public id: string = "",
    public transactionNo: string = "",
    public transactionDate: Date = new Date,
    public recommendingDate: Date = new Date,
    public prId: string = "",
    public prNo: string = "",
    public prDate: Date = new Date,
    public departmentId: string = "",
    public departmentName: string = "",
    public openningDate: Date = new Date,
    public location: string = "",
    public canvasserId: string = "",
    public canvasserName: string = "",
    public procurementMode: string = "",
    public biddingType: string = "",
    public approvedBudget: number = 0,
    public bidSecurity: number = 0,
    public bidDocsFee: number = 0,
    public supplyDescription: string = "",
    public deliveryPeriod: number = 0,
    public priceValidity: number = 0,
    public items: RequestQuotationItemsModel[] = [],
  ) {
    return {
      id,
      transactionNo,
      transactionDate,
      recommendingDate,
      prId,
      prNo,
      prDate,
      departmentId,
      departmentName,
      openningDate,
      location,
      canvasserId,
      canvasserName,
      procurementMode,
      biddingType,
      approvedBudget,
      bidSecurity,
      bidDocsFee,
      supplyDescription,
      deliveryPeriod,
      priceValidity,
      items
    }
  }
}