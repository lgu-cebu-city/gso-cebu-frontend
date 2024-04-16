// ignore_for_file: unnecessary_new, prefer_collection_literals

export class InventorySSMIModel {
  constructor(
    public id: string,
    public code: string,
    public description: string,
    public uom: string,
    public jan: number,
    public feb: number,
    public mar: number,
    public apr: number,
    public may: number,
    public jun: number,
    public jul: number,
    public aug: number,
    public sep: number,
    public oct: number,
    public nov: number,
    public dec: number,
    public totalQty: number,
    public price: number,
    public totalCost: number
  ) {
    return {
      id,
      code,
      description,
      uom,
      jan,
      feb,
      mar,
      apr,
      may,
      jun,
      jul,
      aug,
      sep,
      oct,
      nov,
      dec,
      totalQty,
      price,
      totalCost
    }
  }
}