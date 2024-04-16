// ignore_for_file: unnecessary_new, prefer_collection_literals, non_constant_identifier_names

export class BusinessApplicationModel {
  constructor(
    public id: string = "",
    public transaction_no: string = "",
    public user_id: string = "",
    public user_name: string = "",
    public application_type: string = "",
    public payment_type: string = "",
    public tax_year: string = "",
    public organization_type: string = "",
    public business_name: string = "",
    public trade_name: string = "",
    public tin_no: string = "",
    public dtiseccda_registration_date: string = "",
    public dtiseccda_registration_no: string = "",
    public remarks: string = "",
    public application_status: string = "",
    public attachment: AttachmentModel[]= [],
    public business_owner_info: BusinessOwnerInfoModel[]= [],
    public business_contact_info: BusinessContactInfoModel[]= [],
    public business_address_info: BusinessAddressInfoModel[]= [],
    public business_owner_address_info: BusinessOwnerAddressInfoModel[]= [],
    public business_operation_info: BusinessOperationInfoModel = null,
  ) {
    return {
      id,
      transaction_no,
      user_id,
      user_name,
      application_type,
      payment_type,
      tax_year,
      organization_type,
      business_name,
      trade_name,
      tin_no,
      dtiseccda_registration_date,
      dtiseccda_registration_no,
      remarks,
      application_status,
      attachment,
      business_owner_info,
      business_contact_info,
      business_address_info,
      business_owner_address_info,
      business_operation_info
    }
  }
}

class AttachmentModel {
  constructor(
    public id: string = "",
    public file_type: string = "",
    public file_name: string = "",
    public file_description: string = "",
    public file_url: string = "",
    public remarks: string = "",
    public status: string = "",
  ) {
    return {
      id,
      file_type,
      file_name,
      file_description,
      file_url,
      remarks,
      status
    }
  }
}

class BusinessOwnerInfoModel {
  constructor(
    public id: string = "",
    public first_name: string = "",
    public middle_name: string = "",
    public last_name: string = "",
    public suffix: string = "",
    public gender: string = "",
    public remarks: string = "",
  ) {
    return {
      id,
      first_name,
      middle_name,
      last_name,
      suffix,
      gender,
      remarks
    }
  }
}

class BusinessContactInfoModel {
  constructor(
    public id: string = "",
    public mobile_number: string = "",
    public tel_fax_number: string = "",
    public email_address: string = "",
    public remarks: string = "",
  ) {
    return {
      id,
      mobile_number,
      tel_fax_number,
      email_address,
      remarks,
    }
  }
}

class BusinessAddressInfoModel {
  constructor(
    id: string = "",
    region: string = "",
    province: string = "",
    city_municipality: string = "",
    barangay: string = "",
    zip_code: string = "",
    house_bldg_no: string = "",
    building_name: string = "",
    lot_unit_no: string = "",
    block_floor_no: string = "",
    street: string = "",
    subdivision: string = "",
    remarks: string = "",
  ) {
    return {
      id,
      region,
      province,
      city_municipality,
      barangay,
      zip_code,
      house_bldg_no,
      building_name,
      lot_unit_no,
      block_floor_no,
      street,
      subdivision,
      remarks,
    }
  }
}

class BusinessOwnerAddressInfoModel {
  constructor(
    id: string = "",
    region: string = "",
    province: string = "",
    city_municipality: string = "",
    barangay: string = "",
    zip_code: string = "",
    house_bldg_no: string = "",
    building_name: string = "",
    lot_unit_no: string = "",
    block_floor_no: string = "",
    street: string = "",
    subdivision: string = "",
    remarks: string = "",
  ) {
    return {
      id,
      region,
      province,
      city_municipality,
      barangay,
      zip_code,
      house_bldg_no,
      building_name,
      lot_unit_no,
      block_floor_no,
      street,
      subdivision,
      remarks,
    }
  }
}

class BusinessOperationInfoModel {
  constructor(
    id: string = "",
    business_activity: string = "",
    business_area: number = 0,
    total_floor_area: number = 0,
    number_male_employee: number = 0,
    number_female_employee: number = 0,
    total_number_employee_establishment: number = 0,
    total_number_employee_residing_lgu: number = 0,
    has_delivery_vehicles: boolean = false,
    total_delivery_vehicle_van_truck: number = 0,
    total_delivery_vehicle_motorcycle: number = 0,
    place_owned_rented: string = "",
    taxdec_number: string = "",
    property_index_number: string = "",
    government_tax_incentives_enjoy: string = "",
    community_tax_certificate: string = "",
    barangay_micro_business_enterprise_registered: string = "",
    bangko_sentral_registered: string = "",
    remarks: string = "",
  ) {
    return {
      id,
      business_activity,
      business_area,
      total_floor_area,
      number_male_employee,
      number_female_employee,
      total_number_employee_establishment,
      total_number_employee_residing_lgu,
      has_delivery_vehicles,
      total_delivery_vehicle_van_truck,
      total_delivery_vehicle_motorcycle,
      place_owned_rented,
      taxdec_number,
      property_index_number,
      government_tax_incentives_enjoy,
      community_tax_certificate,
      barangay_micro_business_enterprise_registered,
      bangko_sentral_registered,
      remarks,
    }
  }
}