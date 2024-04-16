// ignore_for_file: unnecessary_new, prefer_collection_literals

export class ProjectProposalSOFModel {
  constructor(
    public sofId: number,
    public sofDescription: string,
    public year: number,
    public amount: number
  ) {
    return {
      sofId,
      sofDescription,
      year,
      amount
    }
  }
}