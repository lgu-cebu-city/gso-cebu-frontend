import { environment } from "src/environments/environment";

export class requestRoutes {
  private baseUrl: string = "http://" + environment.apiUrl + ":" + environment.apiPort;
  private apiVersion: string = "/api/" + environment.apiVersion + "/";

  public baseUrlGSO: string = this.baseUrl + this.apiVersion;

  public userApi: string = "user";
  public employeeApi: string = "employee";
  public itemTypeApi: string = "type";
  public itemGroupApi: string = "group";
  public listItemsApi: string = "item";
  public listUnitConversionApi: string = "unitConversion";

  public appropriation: string = "appropriation";
  public listSOFDataApi: string = "appropriation/by-deptsofcatyear";
  public SOFDataApi: string = "appropriation";
  public SOFDataBySOFIds: string = "appropriation/by-sofids";
  public listBarangayApi: string = "barangay";
  public listGenBarangayApi: string = "gen-barangay";
  public listDepartmentApi: string = "department";
  public listSupplierApi: string = "supplier";
  public listFundCategoryApi: string = "fundCategory";
  public listSOFApi: string = "sof";
  public projectProposal: string = "project-proposal";
  public purchaseRequest: string = "purchase-request";
  public purchaseOrder: string = "purchase-order";
  public requestQuotation: string = "request-quotation";
  public requestQuotationItems: string = "request-quotation/items-by-rfqid";
  public abstractOfCanvass: string = "abstract-of-canvass";
  public abstractOfCanvassProj: string = "abstract-of-canvass/project";
  public acceptanceAndInspectionReport: string = "inspection-and-acceptance-report";
  public inspectionAndAcceptanceReportActual: string = "inspection-and-acceptance-report-actual";
  public acknowledgmentReceiptOfEquipment: string = "acknowledgement-reecipt-of-equipment";
  public inventoryCustodianSlip: string = "inventory-custodian-slip";
  public requisitionAndIssuance: string = "requisition-issuance-slip";
  public propertyTransfer: string = "property-transfer";
  public barangayIssuance: string = "barangay-issuance";
  public inventoryReport: string = "inventory-report";
  public requestForInspection: string = "request-for-inspection";
  public requestForRepair: string = "request-for-repair";
  public wasteMaterialReport: string = "waste-material-report";
  public propertyRequisitionSlip: string = "property-requisition-slip";
  public propertyAccountabilitySlip: string = "property-accountability-slip";
  public propertyReturnSlip: string = "property-return-slip";
  public preRepairInspection: string = "pre-repair-inspection";
  public postRepairInspection: string = "post-repair-inspection";


  // BUDGET
  public baseUrlBudget: string = "http://" + environment.serverApiUrl + ":" + environment.budgetApiPort + "/api/" + environment.apiVersion + "/";
  public appAPi: string = "app";


  // HR
  public baseUrlHR: string = "http://" + environment.serverApiUrl + ":" + environment.hrApiPort + "/api/" + environment.apiVersion + "/";
  public employeeAPi: string = "setup-employee/signatory-gso2";
}