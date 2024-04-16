// ignore_for_file: unnecessary_new, prefer_collection_literals

export class FundCategory {
  constructor(
    public id: string,
    public book: number,
    public fundId: number,
    public name: string,
    public code: string,
    public classOrder: number,
  ) {
    return {
      id,
      book,
      fundId,
      name,
      code,
      classOrder,
    }
  }
}