// ignore_for_file: unnecessary_new, prefer_collection_literals

export class Type {
  constructor(
    public id: string,
    public description: string,
    public groupName: string,
    public groupId: string,
    public categoryName: string,
    public categoryId: string,
    public isMedicine: string,
    public isWithExpiry: string,
  ) {
    return {
      id,
      description,
      groupName,
      groupId,
      categoryName,
      categoryId,
      isMedicine,
      isWithExpiry,
    }
  }
}