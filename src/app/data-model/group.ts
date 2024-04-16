// ignore_for_file: unnecessary_new, prefer_collection_literals

import { Type } from "./type";

export class Group {
  constructor(
    public id: string,
    public description: string,
    public type: Type[]
  ) {
    return {
      id,
      description,
      type
    }
  }
}