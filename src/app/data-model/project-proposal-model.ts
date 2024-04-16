// ignore_for_file: unnecessary_new, prefer_collection_literals

import { ProjectProposalItemsModel } from "./project-proposal-items-model";
import { ProjectProposalSOFModel } from "./project-proposal-sof-model";

export class ProjectProposalModel {
  constructor(
    public id: string,
    public referenceNo: string,
    public referenceDate: Date,
    public departmentId: string,
    public departmentName: string,
    public projectTitle: string,
    public projectLocation: string,
    public projLocBarangay: string,
    public description: string,
    public rationale: string,
    public projectStartDate: Date,
    public projectDuration: string,
    public projectType: string,
    public projectCost: number,
    public sourceOfFund: string,
    public sof: ProjectProposalSOFModel[],
    public items: ProjectProposalItemsModel[],
  ) {
    return {
      id,
      referenceNo,
      referenceDate,
      departmentId,
      departmentName,
      projectTitle,
      projectLocation,
      projLocBarangay,
      description,
      rationale,
      projectStartDate,
      projectDuration,
      projectType,
      projectCost,
      sourceOfFund,
      sof,
      items
    }
  }
}