// ignore_for_file: unnecessary_new, prefer_collection_literals

export class EmployeeModel {
  constructor(
    public id: string,
    public badge_id: string,
    public code: string,
    public first_name: string,
    public last_name: string,
    public middle_name: string,
    public name: string,
    public type: string,
    public status: string,
    public hired_date: Date,
    public resignation_date: Date,
    public position: string,
    public gender: string,
    public dob: Date,
    public cat: Date,
    public dat: Date
  ) {
    return {
      id,
      badge_id,
      code,
      first_name,
      last_name,
      middle_name,
      name,
      type,
      status,
      hired_date,
      resignation_date,
      position,
      gender,
      dob,
      cat,
      dat,
    }
  }
}