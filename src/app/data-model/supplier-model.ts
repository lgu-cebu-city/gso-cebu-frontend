// ignore_for_file: unnecessary_new, prefer_collection_literals

export class Supplier {
  constructor(
    public id: string = "",
    public name: string = "",
    public address: string = "",
    public contactNumber: string = "",
    public contactPerson: string = "",
  ) {
    return {
      id,
      name,
      address,
      contactNumber,
      contactPerson,
    }
  }
}