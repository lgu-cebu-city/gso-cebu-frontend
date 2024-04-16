// ignore_for_file: unnecessary_new, prefer_collection_literals

export class UnitConversion {
  constructor(
    public id: string,
    public unit1: string,
    public quantity1: number,
    public unit2: string,
    public quantity2: number,
    public unit3: string,
    public quantity3: number,
    public unit4: string,
    public quantity4: number,
    public itemType: string
  ) {
    return {
      id,
      unit1,
      quantity1,
      unit2,
      quantity2,
      unit3,
      quantity3,
      unit4,
      quantity4,
      itemType
    }
  }
}