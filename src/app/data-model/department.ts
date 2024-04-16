// ignore_for_file: unnecessary_new, prefer_collection_literals

export class Department {
  constructor(
    public id: string,
    public code: string,
    public nationalCode: string,
    public name: string,
    public type: string,
    public description: string,
    public sequence: number,
    public status: string,
    public prefix: string,
    public group_code: string,
    public group_name: string,
    public position_category: string,
    public emp_head: string,
    public positionId: string,
    public position_name: string,
  ) {
    return {
      id,
      code,
      nationalCode,
      name,
      type,
      description,
      sequence,
      status,
      prefix,
      group_code,
      group_name,
      position_category,
      emp_head,
      positionId,
      position_name
    }
  }
}