// ignore_for_file: unnecessary_new, prefer_collection_literals

export class InventoryMedicineModel {
  constructor(
    public id: string,
    public refId: string,
    public refType: string,
    public departmentId: string,
    public sectionId: string,
    public groupId: string,
    public itemId: string,
    public brandId: string,
    public code: string,
    public description: string,
    public uom: string,
    public quantity: number,
    public price: string,
    public expirationDate: Date,
    public lotNo: string,
  ) {
    return {
      id,
      refId,
      refType,
      departmentId,
      sectionId,
      groupId,
      itemId,
      brandId,
      code,
      description,
      uom,
      quantity,
      price,
      expirationDate,
      lotNo
    }
  }
}