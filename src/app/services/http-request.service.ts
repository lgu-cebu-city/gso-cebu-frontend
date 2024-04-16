import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { isRegExp } from 'util';
import { AbstractOfCanvassModel } from '../data-model/abstract-of-canvass-model';
import { AcceptanceAndInspectionReportModel } from '../data-model/acceptance-and-inspection-report-model';
import { AcknowledgementReceiptModel } from '../data-model/acknowledgment-receipt-model';
import { BarangayIssuance } from '../data-model/barangay-issuance-model';
import { ProjectProposalModel } from '../data-model/project-proposal-model';
import { PropertyAccountabilityModel } from '../data-model/property-accountability-model';
import { PropertyRequisitionModel } from '../data-model/property-requisition-model';
import { PropertyReturnModel } from '../data-model/property-return-model';
import { PropertyTransfer } from '../data-model/property-transfer-model';
import { PurchaseOrderModel } from '../data-model/purchase-order-model';
import { PurchaseRequestModel } from '../data-model/purchase-request-model';
import { RequestForInspectionModel } from '../data-model/request-for-inspection-model';
import { RequestForRepairModel } from '../data-model/request-for-repair-model';
import { RequestQuotationModel } from '../data-model/requestQuotationModel';
import { RequisitionAndIssuanceModel } from '../data-model/requisition-and-issuance-model';
import { Supplier } from '../data-model/supplier-model';
import { UserModel } from '../data-model/user-model';
import { WasteMaterialReportModel } from '../data-model/waste-material-report-model';
import { requestRoutes } from '../util/request_routes';
import { InventoryCustodianSlipModel } from '../data-model/inventory-custodian-slip-model';
import { PostRepairInspectionModel } from '../data-model/post-repair-inspection-model';
import { PreRepairInspectionModel } from '../data-model/pre-repair-inspection-model';

var routes = new requestRoutes();

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  
  constructor(private http: HttpClient) { }

  isUserAvailable(username: string, password: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.userApi;
    url = url + "/login"
    var body = {
      "username": username,
      "password": password
    }
    return this.http.post(url, body);
  }

  getUsers(): Observable<any> {
    return this.http.get(routes.baseUrlGSO + routes.userApi);
  }

  saveUser(data: UserModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.userApi;
    url = url + "/register";
    return this.http.post(url, data);
  }

  updateUser(id: string, data: UserModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.userApi;
    url = url + "/update/" + id;
    return this.http.patch(url, data);
  }

  deleteUser(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.userApi;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getItemGroup(): Observable<any> {
    return this.http.get(routes.baseUrlGSO + routes.itemGroupApi);
  }

  getItemGroupWithType(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.itemGroupApi;
    url = url + "/withType";
    return this.http.get(url);
  }

  getItemGroupWithTypeDistinct(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.itemGroupApi;
    url = url + "/withTypeDistinct";
    return this.http.get(url);
  }

  getItemType(): Observable<any> {
    return this.http.get(routes.baseUrlGSO + routes.itemTypeApi);
  }

  getItemTypeById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.itemTypeApi;
    url = url + "/" + _id;
    return this.http.get(url);
  }

  getItemTypeByGroup(_group: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.itemTypeApi;
    url = url + "/bygroup/" + _group;
    return this.http.get(url);
  }

  saveSupplier(data: Supplier): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listSupplierApi;
    return this.http.post(url, data);
  }

  updateSupplier(id: string, data: Supplier): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listSupplierApi;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  deleteSupplier(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listSupplierApi;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getSupplierAll(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listSupplierApi;
    return this.http.get(url);
  }

  getSupplierById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listSupplierApi;
    url = url + "/" + ptId;
    return this.http.get(url);
  }

  getListItem(): Observable<any> {
    return this.http.get(routes.baseUrlGSO + routes.listItemsApi);
  }

  getListAllMedicalItems(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/medical/all";
    return this.http.get(url);
  }

  getListAllItems(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/items/all";
    return this.http.get(url);
  }

  getListNonInvtyItem(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/non-invty/all";
    return this.http.get(url);
  }

  getItemTransactionNo(_prefix: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/transactionNo/transNo/" + _prefix;
    return this.http.get(url);
  }

  getListItemByCategory(_category: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/category/" + _category
    return this.http.get(url);
  }

  getListMedicalItemByCategory(_category: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/medical/category/" + _category
    return this.http.get(url);
  }

  getListNonInvtyItemByCategory(_category: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/non-invty/category/" + _category
    return this.http.get(url);
  }

  getListItemByItemCode(_itemCode: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/itemCode/" + _itemCode
    return this.http.get(url);
  }

  getListItemByCategoryType(_category: string, _type: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/category/" + _category
    url = url + "/type/" + _type
    return this.http.get(url);
  }

  getListItemByCategoryTypeDepartment(_category: string, _type: string, _deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/category/" + _category;
    url = url + "/type/" + _type;
    url = url + "/department/" + _deptId;
    return this.http.get(url);
  }

  getListItemByCategoryAllType(_category: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/categoryTypeAll/" + _category
    return this.http.get(url);
  }

  getListItemByCategoryAllTypeDepartment(_category: string, _deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/categoryTypeAll/" + _category;
    url = url + "/department/" + _deptId;
    return this.http.get(url);
  }

  getItemById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/" + _id;
    return this.http.get(url);
  }

  addItem(data: any): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    return this.http.post(url, data);
  }

  updateItem(id: string, data: any): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url += "/" + id;
    return this.http.patch(url, data);
  }

  lockItem(id: string, status: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url += "/lock-item/" + id;
    url += "/" + status;
    return this.http.patch(url, {});
  }

  deleteItem(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url += "/" + id;
    return this.http.delete(url);
  }

  getItemRelation(_category: string, _id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listItemsApi;
    url = url + "/itemRelation/category/" + _category + "/id/" + _id;
    return this.http.get(url);
  }

  getListUnitConversion(): Observable<any> {
    return this.http.get(routes.baseUrlGSO + routes.listUnitConversionApi);
  }

  getUnitConversionById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listUnitConversionApi;
    url = url + "/byId/" + _id;
    return this.http.get(url);
  }

  getUnitConversionByType(_type: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listUnitConversionApi;
    url = url + "/byType/" + _type;
    return this.http.get(url);
  }

  addUnitConversion(data: any): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listUnitConversionApi;
    return this.http.post(url, data);
  }

  updateUnitConversion(id: string, data: any): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listUnitConversionApi;
    url += "/" + id;
    return this.http.patch(url, data);
  }

  deleteUnitConversion(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listUnitConversionApi;
    url += "/" + id;
    return this.http.delete(url);
  }

  getSourceOfFund(sof: string, dept: string, cat: string, year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listSOFDataApi;
    var body = {
      "SOF": sof,
      "DepartmentName": dept,
      "BYear": year,
      "Category": cat
    }
    return this.http.post(url, body);
  }

  getSourceOfFundById(_id: number): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.SOFDataApi;
    url = url + "/" + _id;
    return this.http.get(url);
  }

  getSourceOfFundByIds(_ids: number[]): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.SOFDataBySOFIds;
    return this.http.post(url, _ids);
  }

  getFundCategoryByFundId(_fundId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listFundCategoryApi;
    url = url + "/fundId/" + _fundId;
    return this.http.get(url);
  }

  getBarangayAll(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listBarangayApi;
    return this.http.get(url);
  }

  getGenBarangayAll(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listGenBarangayApi;
    return this.http.get(url);
  }

  getDepartmentAll(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listDepartmentApi;
    return this.http.get(url);
  }

  getDepartmentById(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listDepartmentApi;
    url = url + "/" + _deptId;
    return this.http.get(url);
  }

  getFundCategory(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listFundCategoryApi;
    return this.http.get(url);
  }

  getSOF(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listSOFApi;
    return this.http.get(url);
  }

  getAccounts(year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.appropriation;
    url = url + "/by-year/" + year;
    return this.http.get(url);
  }

  saveProjectProposal(pp: ProjectProposalModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.projectProposal;
    return this.http.post(url, pp);
  }

  updateProjectProposal(id: string, pp: ProjectProposalModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.projectProposal;
    url = url + "/" + id;
    return this.http.patch(url, pp);
  }

  getProjectProposalTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.projectProposal;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  getAllProjectProposal(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.projectProposal;
    return this.http.get(url);
  }

  getProjectProposalById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.projectProposal;
    url = url + "/" + _id
    return this.http.get(url);
  }

  deleteProjectProposal(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.projectProposal;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  savePurchaseRequestAttachment(file: File): Observable<any> {
    var url: string = "https://api.cloudinary.com/v1_1/de42wowt2/Attachment/PR";
    var data = {
      context: 'image=' + file.name,
      file: file,
      withcredentials: false,
    };
    return this.http.post(url, data, {headers: {
      'Access-Control-Allow-Origin' : '*'
    }});
  }

  savePurchaseRequest(pr: PurchaseRequestModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    return this.http.post(url, pr);
  }

  updatePurchaseRequest(id: string, pp: PurchaseRequestModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/" + id;
    return this.http.patch(url, pp);
  }

  setLockPurchaseRequest(id: string, isLocked: boolean): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/lockPr/" + id + "/" + isLocked;
    return this.http.patch(url, {});
  }

  getPurchaseRequestTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  getPurchaseRequestTransactionCount(prId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/transaction/count/" + prId;
    return this.http.get(url);
  }

  getPurchaseRequestConsoTransactionCount(prIds: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/consotransaction/count/" + prIds;
    return this.http.get(url);
  }

  getPurchaseRequestCalloutTransactionCount(prIds: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/callouttransaction/count/" + prIds;
    return this.http.get(url);
  }

  getAllPurchaseRequest(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    return this.http.get(url);
  }

  getAllPurchaseRequestByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllPurchaseRequestForConsoByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byMonthYear/forConso/" + date;
    return this.http.get(url);
  }

  getAllPurchaseRequestByMonthYearDBM(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byMonthYear/dbm/" + date;
    return this.http.get(url);
  }

  getAllPurchaseRequestForConsoByMonthYearDBM(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byMonthYear/forConso/dbm/" + date;
    return this.http.get(url);
  }

  getAllPurchaseRequestByDateRange(dateFrom: string, dateTo: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byDateRange/" + dateFrom + "/" + dateTo;
    return this.http.get(url);
  }

  getAllPurchaseRequestForConsoByDateRange(dateFrom: string, dateTo: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byDateRange/forConso/" + dateFrom + "/" + dateTo;
    return this.http.get(url);
  }

  getAllPurchaseRequestByQuarter(qtr: string, year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byQuarter/" + qtr;
    url = url + "/" + year;
    return this.http.get(url);
  }

  getAllPurchaseRequestForConsoByQuarter(qtr: string, year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byQuarter/forConso/" + qtr;
    url = url + "/" + year;
    return this.http.get(url);
  }

  getAllPurchaseRequestByQuarterDBM(qtr: string, year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byQuarter/dbm/" + qtr;
    url = url + "/" + year;
    return this.http.get(url);
  }

  getAllPurchaseRequestForConsoByQuarterDBM(qtr: string, year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byQuarter/forConso/dbm/" + qtr;
    url = url + "/" + year;
    return this.http.get(url);
  }

  getAllPurchaseRequestItemsByDeptYear(_deptId: string, _year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/prItems/" + _deptId + "/" + _year;
    return this.http.get(url);
  }

  getAllPurchaseRequestIncludingClosedByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byMonthYearIncludingClosed/" + date;
    return this.http.get(url);
  }

  getAllPurchaseRequestIncludingClosedByDateRange(dateFrom: string, dateTo: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byDateRangeIncludingClosed/" + dateFrom + "/" + dateTo;
    return this.http.get(url);
  }

  getAllPurchaseRequestIncludingClosedByQuarter(qtr: string, year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byQuarterIncludingClosed/" + qtr;
    url = url + "/" + year;
    return this.http.get(url);
  }

  getAllConsolidatedPurchaseRequest(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/consolidated/all";
    return this.http.get(url);
  }

  getAllConsolidatedPurchaseRequestByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/consolidated/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllConsolidatedPurchaseRequestByDateRange(dateFrom: string, dateTo: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/consolidated/byDateRange/" + dateFrom + "/" + dateTo;
    return this.http.get(url);
  }

  getAllConsolidatedPurchaseRequestByQuarter(qtr: string, year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/consolidated/byQuarter/" + qtr;
    url = url + "/" + year;
    return this.http.get(url);
  }

  getAllPurchaseRequestLogsByPrId(_prId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byPrId/" + _prId;
    return this.http.get(url);
  }

  getAllPurchaseRequestByDepartment(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byDepartment/" + _deptId;
    return this.http.get(url);
  }

  getAllPurchaseRequestWithIssuanceByDepartment(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/withIssuance/byDepartment/" + _deptId;
    return this.http.get(url);
  }

  getAllPurchaseRequestByDepartmentMonthYear(_deptId: string, date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byDepartmentMonthYear/" + _deptId;
    url = url + "/" + date;
    return this.http.get(url);
  }

  getAllPurchaseRequestByDepartmentByDateRange(_deptId: string, dateFrom: string, dateTo: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byDepartmentByDateRange/" + _deptId;
    url = url + "/" + dateFrom + "/" + dateTo;
    return this.http.get(url);
  }

  getAllPurchaseRequestByDepartmentByQuarter(_deptId: string, qtr: string, year: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/byDepartmentByQuarter/" + _deptId;
    url = url + "/" + qtr;
    url = url + "/" + year;
    return this.http.get(url);
  }

  getTotalPOPerDept(_deptId: string, year: string, accId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/totalAmountPerAccPerDept/" + _deptId;
    url = url + "/" + year;
    url = url + "/" + accId;
    return this.http.get(url);
  }

  getPurchaseRequestById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/" + _id;
    return this.http.get(url);
  }

  deletePurchaseRequest(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseRequest;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getAllAPPItems(year:number, office: string, appropriation: number): Observable<any> {
    var url: string = routes.baseUrlBudget + routes.appAPi;
    url = url + "?year=" + year;
    url = url + "&office=" + office;
    url = url + "&appropriation=" + appropriation;
    
    return this.http.get(url, {
      headers: {
        'Authorization' : 'Bearer ' + environment.budgetAPIKey
      }
    });
  }

  savePurchaseOrder(pr: PurchaseOrderModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    return this.http.post(url, pr);
  }

  updatePurchaseOrder(id: string, pp: PurchaseOrderModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/" + id;
    return this.http.patch(url, pp);
  }

  getPurchaseOrderTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  getPurchaseOrderTransactionCount(poId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/transaction/count/" + poId;
    return this.http.get(url);
  }

  getAllPurchaseOrder(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    return this.http.get(url);
  }

  getAllPurchaseOrderByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllPurchaseOrderByMonthYearWithDR(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/byMonthYearWithDR/" + date;
    return this.http.get(url);
  }

  getAllPurchaseOrderForIARByMonthYearWithDR(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/byMonthYearWithDR/forIAR/" + date;
    return this.http.get(url);
  }

  getAllPurchaseOrderForIARActualByMonthYearWithDR(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/byMonthYearWithDR/forIARActual/" + date;
    return this.http.get(url);
  }

  getPurchaseOrderById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/" + _id;
    return this.http.get(url);
  }

  deletePurchaseOrder(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.purchaseOrder;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getAcceptanceAndInspectionReportTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  saveAcceptanceAndInspectionReport(iar: AcceptanceAndInspectionReportModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    return this.http.post(url, iar);
  }

  updateAcceptanceAndInspectionReport(id: string, iar: AcceptanceAndInspectionReportModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    url = url + "/" + id;
    return this.http.patch(url, iar);
  }

  deleteAcceptanceAndInspectionReport(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getAllAcceptanceAndInspectionReport(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    return this.http.get(url);
  }

  getAllAcceptanceAndInspectionReportByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllAcceptanceAndInspectionReportARE(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    url = url + "/are/all";
    return this.http.get(url);
  }

  getAllAcceptanceAndInspectionReportICS(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    url = url + "/ics/all";
    return this.http.get(url);
  }

  getAcceptanceAndInspectionReportById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acceptanceAndInspectionReport;
    url = url + "/byId/" + _id;
    return this.http.get(url);
  }

  getAcceptanceAndInspectionReportActualTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  saveAcceptanceAndInspectionReportActual(iar: AcceptanceAndInspectionReportModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    return this.http.post(url, iar);
  }

  updateAcceptanceAndInspectionReportActual(id: string, iar: AcceptanceAndInspectionReportModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    url = url + "/" + id;
    return this.http.patch(url, iar);
  }

  deleteAcceptanceAndInspectionReportActual(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getAllAcceptanceAndInspectionReportActual(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    return this.http.get(url);
  }

  getAllAcceptanceAndInspectionReportActualByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllAcceptanceAndInspectionReportActualARE(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    url = url + "/are/all";
    return this.http.get(url);
  }

  getAllAcceptanceAndInspectionReportActualICS(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    url = url + "/ics/all";
    return this.http.get(url);
  }

  getAcceptanceAndInspectionReportActualById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inspectionAndAcceptanceReportActual;
    url = url + "/byId/" + _id;
    return this.http.get(url);
  }

  getAcknowledgmentReceiptOfEquipmentTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  getAcknowledgmentReceiptOfEquipmentPropertyNo(prefix: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/propertyNo/" + prefix;
    return this.http.get(url);
  }

  saveAcknowledgmentReceiptOfEquipment(iar: AcknowledgementReceiptModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    return this.http.post(url, iar);
  }

  updateAcknowledgmentReceiptOfEquipment(id: string, iar: AcknowledgementReceiptModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/" + id;
    return this.http.patch(url, iar);
  }

  getAllAcknowledgmentReceiptOfEquipment(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    return this.http.get(url);
  }

  getAllAcknowledgmentReceiptOfEquipmentByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllAcknowledgmentReceiptOfEquipmentItems(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/are/items/all";
    return this.http.get(url);
  }

  getAllAcknowledgmentReceiptOfEquipmentItemsByDept(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/are/deptitems/" + _deptId;
    return this.http.get(url);
  }

  getAllAcknowledgmentReceiptOfEquipmentItemsById(_areId: string, _id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/are/items/" + _areId + "/" + _id;
    return this.http.get(url);
  }

  getAcknowledgmentReceiptOfEquipmentById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/" + _id;
    return this.http.get(url);
  }

  deleteAcknowledgmentReceiptOfEquipment(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.acknowledgmentReceiptOfEquipment;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getInventoryCustodianSlipTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryCustodianSlip;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  getInventoryCustodianSlipPropertyNo(prefix: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryCustodianSlip;
    url = url + "/propertyNo/" + prefix;
    return this.http.get(url);
  }

  saveInventoryCustodianSlip(iar: InventoryCustodianSlipModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryCustodianSlip;
    return this.http.post(url, iar);
  }

  updateInventoryCustodianSlip(id: string, iar: InventoryCustodianSlipModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryCustodianSlip;
    url = url + "/" + id;
    return this.http.patch(url, iar);
  }

  getAllInventoryCustodianSlip(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryCustodianSlip;
    return this.http.get(url);
  }

  getAllInventoryCustodianSlipByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryCustodianSlip;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getInventoryCustodianSlipById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryCustodianSlip;
    url = url + "/" + _id;
    return this.http.get(url);
  }

  deleteInventoryCustodianSlip(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryCustodianSlip;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  saveRequestQuotation(data: RequestQuotationModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    return this.http.post(url, data);
  }

  updateRequestQuotation(id: string, data: RequestQuotationModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getRequestQuotationTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  getRequestQuotationTransactionCount(rfqId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    url = url + "/transaction/count/" + rfqId;
    return this.http.get(url);
  }

  getAllRequestQuotation(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    return this.http.get(url);
  }

  getAllRequestQuotationByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllRequestQuotationForAOQByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    url = url + "/byMonthYear/forAOQ/" + date;
    return this.http.get(url);
  }

  getRequestQuotationItems(rfqId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotationItems;
    url = url + "/" + rfqId;
    return this.http.get(url);
  }

  getRequestQuotationById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    url = url + "/" + _id
    return this.http.get(url);
  }

  deleteRequestQuotation(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestQuotation;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  saveAbstractOfCanvass(data: AbstractOfCanvassModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    return this.http.post(url, data);
  }

  getAbstractOfCanvassTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  updateAbstractOfCanvass(id: string, data: AbstractOfCanvassModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllAbstractOfCanvass(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/find-all"
    return this.http.get(url);
  }

  getAllAbstractOfCanvassByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/find-all/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllApprovedAbstractOfCanvass(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/listApprovedCanvass"
    return this.http.get(url);
  }

  getAllApprovedAbstractOfCanvassByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/listApprovedCanvass/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllApprovedAbstractOfCanvassForPOByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/listApprovedCanvass/byMonthYear/forPO/" + date;
    return this.http.get(url);
  }

  getApprovedAbstractOfCanvassById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/approvedCanvass/" + _id;
    return this.http.get(url);
  }

  getAbstractOfCanvassProject(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvassProj;
    url = url + "/" + _id
    return this.http.get(url);
  }

  getAbstractOfCanvassById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/find-by-id/" + _id
    return this.http.get(url);
  }

  deleteAbstractOfCanvass(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.abstractOfCanvass;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getRequestIssuanceSlipTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  saveRequisition(data: RequisitionAndIssuanceModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    return this.http.post(url, data);
  }

  updateRequisition(id: string, data: RequisitionAndIssuanceModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  updateIssuance(id: string, data: RequisitionAndIssuanceModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/update-issuance/" + id;
    return this.http.patch(url, data);
  }

  getAllRequisitionAndIssuance(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    return this.http.get(url);
  }

  getAllRequisitionAndIssuanceByTransType(_transType: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/transactiontype/" + _transType;
    return this.http.get(url);
  }

  getAllRequisitionAndIssuanceByIssuanceType(_issuanceType: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/issuancetype/" + _issuanceType;
    return this.http.get(url);
  }

  getAllIssuance(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/issuance/all";
    return this.http.get(url);
  }

  getAllRequisitionAndIssuanceByDepartment(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/byDepartment/" + _deptId;
    return this.http.get(url);
  }

  getAllRequisitionAndIssuanceByDepartmentByTransType(_transType: string, _deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/byDepartment/" + _deptId;
    url = url + "/transactiontype/" + _transType;
    return this.http.get(url);
  }

  getAllRequisitionAndIssuanceByDepartmentByIssuanceType(_issuanceType: string, _deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/byDepartment/" + _deptId;
    url = url + "/issuancetype/" + _issuanceType;
    return this.http.get(url);
  }

  getAllIssuanceByDepartment(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/byDepartment/" + _deptId;
    url = url + "/issuance/all";
    return this.http.get(url);
  }

  getRequisitionAndIssuanceById(risId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/" + risId;
    return this.http.get(url);
  }

  deleteRequisitionAndIssuance(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requisitionAndIssuance;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getPropertyTransferTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyTransfer;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  savePropertyTransfer(data: PropertyTransfer): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyTransfer;
    return this.http.post(url, data);
  }

  updatePropertyTransfer(id: string, data: PropertyTransfer): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyTransfer;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllPropertyTransfer(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyTransfer;
    return this.http.get(url);
  }

  getPropertyTransferById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyTransfer;
    url = url + "/" + ptId;
    return this.http.get(url);
  }

  deletePropertyTransfer(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyTransfer;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getBarangayIssuanceTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.barangayIssuance;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  saveBarangayIssuance(data: BarangayIssuance): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.barangayIssuance;
    return this.http.post(url, data);
  }

  updateBarangayIssuance(id: string, data: BarangayIssuance): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.barangayIssuance;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllBarangayIssuance(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.barangayIssuance;
    return this.http.get(url);
  }

  getAllBarangayIssuanceByDepartment(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.barangayIssuance;
    url = url + "/byDepartment/" + _deptId;
    return this.http.get(url);
  }

  getBarangayIssuanceById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.barangayIssuance;
    url = url + "/" + ptId;
    return this.http.get(url);
  }

  deleteBarangayIssuance(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.barangayIssuance;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getAllInventoryReport(deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    if (deptId == "") {
      url = url + "/find-all";
    } else {
      url = url + "/find-all-by-department/" + deptId;
    }
    
    return this.http.get(url);
  }

  getAllInventoryReportbyType(_typeId: string, deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    if (deptId == "") {
      url = url + "/find-all-by-type/" + _typeId;
    } else {
      url = url + "/find-all-by-type-department/" + _typeId;
      url = url + "/" + deptId;
    }
    
    return this.http.get(url);
  }

  getAllInventoryReportMedicine(deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    if (deptId == "") {
      url = url + "/find-all-medicine/";
    } else {
      url = url + "/find-all-medicine-by-department/" + deptId;
    }
    
    return this.http.get(url);
  }

  getAllPropertyInventory(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    url = url + "/find-all-property";
    return this.http.get(url);
  }

  getAllMedicineInventory(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    url = url + "/find-medicine";
    return this.http.get(url);
  }

  getAllMedicineInventoryTest(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    url = url + "/find-medicine-test";
    return this.http.get(url);
  }

  getMedicineByBrandId(_brandId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    url = url + "/find-medicine-brand/" + _brandId;
    return this.http.get(url);
  }

  getAllMedicineInventoryById(itemId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    url = url + "/find-medicine/" + itemId;
    return this.http.get(url);
  }

  getInventoryReportById(_id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    url = url + "/find-by-id/" + _id;
    return this.http.get(url);
  }

  getICSReport(): Observable<any> {
    var paramAmount = environment.paramAmount;
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    url = url + "/ics/" + paramAmount;
    return this.http.get(url);
  }

  getSSMIReport(_year: number): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.inventoryReport;
    url = url + "/ssmi/" + _year;
    return this.http.get(url);
  }

  getRequestForInspectionTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForInspection;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  saveRequestForInspection(data: RequestForInspectionModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForInspection;
    return this.http.post(url, data);
  }

  updateRequestForInspection(id: string, data: RequestForInspectionModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForInspection;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  updateRFIItemRemarks(id: string, remarks: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForInspection;
    url = url + "/remarks/" + id;
    var data = {
      remarks: remarks
    }
    return this.http.patch(url, data);
  }

  getAllRequestForInspection(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForInspection;
    return this.http.get(url);
  }

  getRequestForInspectionById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForInspection;
    url = url + "/" + ptId;
    return this.http.get(url);
  }

  getRequestForRepairTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForRepair;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  saveRequestForRepair(data: RequestForRepairModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForRepair;
    return this.http.post(url, data);
  }

  updateRequestForRepair(id: string, data: RequestForRepairModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForRepair;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  updateRFRItemRemarks(id: string, remarks: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForRepair;
    url = url + "/remarks/" + id;
    var data = {
      remarks: remarks
    }
    return this.http.patch(url, data);
  }

  getAllRequestForRepair(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForRepair;
    return this.http.get(url);
  }

  getRequestForRepairById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.requestForRepair;
    url = url + "/" + ptId;
    return this.http.get(url);
  }
  
  getWasteMaterialReportTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  saveWasteMaterialReport(data: WasteMaterialReportModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    return this.http.post(url, data);
  }

  updateWasteMaterialReport(id: string, data: WasteMaterialReportModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllWasteMaterialReport(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    return this.http.get(url);
  }

  getAllWasteMaterialReportByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getWasteMaterialReportById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/" + ptId;
    return this.http.get(url);
  }

  deleteWasteMaterialReport(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/" + id;
    return this.http.delete(url);
  }
  
  getWmrAreIcsItemsByDept(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/areicsItems/" + _deptId;
    return this.http.get(url);
  }
  
  getWmrAreIcsItemsById(_transId: string, _transType: string, _itemId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/areicsItemsById/" + _transId + "/" + _transType + "/" + _itemId;
    return this.http.get(url);
  }
  
  getWmrPostRepairByDept(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/postRepairItems/" + _deptId;
    return this.http.get(url);
  }
  
  getWmrPostRepairById(_transId: string, _transType: string, _itemId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.wasteMaterialReport;
    url = url + "/postRepairItemsById/" + _transId + "/" + _transType + "/" + _itemId;
    return this.http.get(url);
  }
  
  
  getPropertyRequisitionTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyRequisitionSlip;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  savePropertyRequisition(data: PropertyRequisitionModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyRequisitionSlip;
    return this.http.post(url, data);
  }

  updatePropertyRequisition(id: string, data: PropertyRequisitionModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyRequisitionSlip;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllPropertyRequisition(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyRequisitionSlip;
    return this.http.get(url);
  }

  getPropertyRequisitionById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyRequisitionSlip;
    url = url + "/" + ptId;
    return this.http.get(url);
  }
  
  
  getPropertyAccountabilityTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyAccountabilitySlip;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  savePropertyAccountability(data: PropertyAccountabilityModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyAccountabilitySlip;
    return this.http.post(url, data);
  }

  updatePropertyAccountability(id: string, data: PropertyAccountabilityModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyAccountabilitySlip;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllPropertyAccountability(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyAccountabilitySlip;
    return this.http.get(url);
  }

  getPropertyAccountabilityById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyAccountabilitySlip;
    url = url + "/" + ptId;
    return this.http.get(url);
  }
  
  
  getPropertyReturnTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyReturnSlip;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  savePropertyReturn(data: PropertyReturnModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyReturnSlip;
    return this.http.post(url, data);
  }

  updatePropertyReturn(id: string, data: PropertyReturnModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyReturnSlip;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllPropertyReturn(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyReturnSlip;
    return this.http.get(url);
  }

  getPropertyReturnById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.propertyReturnSlip;
    url = url + "/" + ptId;
    return this.http.get(url);
  }

  getPreRepairInspectionTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.preRepairInspection;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  savePreRepairInspection(data: PreRepairInspectionModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.preRepairInspection;
    return this.http.post(url, data);
  }

  updatePreRepairInspection(id: string, data: PreRepairInspectionModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.preRepairInspection;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllPreRepairInspection(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.preRepairInspection;
    return this.http.get(url);
  }

  getAllPreRepairInspectionByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.preRepairInspection;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getPreRepairInspectionById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.preRepairInspection;
    url = url + "/" + ptId;
    return this.http.get(url);
  }

  deletePreRepairInspection(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.preRepairInspection;
    url = url + "/" + id;
    return this.http.delete(url);
  }

  getPostRepairInspectionTransactionNo(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.postRepairInspection;
    url = url + "/transactionNo/transNo";
    return this.http.get(url);
  }

  savePostRepairInspection(data: PostRepairInspectionModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.postRepairInspection;
    return this.http.post(url, data);
  }

  updatePostRepairInspection(id: string, data: PostRepairInspectionModel): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.postRepairInspection;
    url = url + "/" + id;
    return this.http.patch(url, data);
  }

  getAllPostRepairInspection(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.postRepairInspection;
    return this.http.get(url);
  }

  getAllPostRepairInspectionByMonthYear(date: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.postRepairInspection;
    url = url + "/byMonthYear/" + date;
    return this.http.get(url);
  }

  getAllPostRepairInspectionForWaste(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.postRepairInspection;
    url = url + "/all/forWaste";
    return this.http.get(url);
  }

  getPostRepairInspectionById(ptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.postRepairInspection;
    url = url + "/" + ptId;
    return this.http.get(url);
  }

  deletePostRepairInspection(id: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.postRepairInspection;
    url = url + "/" + id;
    return this.http.delete(url);
  }



  // Employee for Signatory
  getEmployees(): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listDepartmentApi;
    url = url + "/signatory/all";
    return this.http.get(url);
  }
  
  getDefaultSignatory(_deptId: string): Observable<any> {
    var url: string = routes.baseUrlGSO + routes.listDepartmentApi;
    url = url + "/signatory/default/" + _deptId;
    return this.http.get(url);
  }
  
  // Test Only
  getBusinessApplication(): Observable<any> {
    var url: string = "http://143.198.91.135:9009/api/v1/business-application";
    return this.http.get(url);
  }
  updateBusinessStatus(id: String, status: String): Observable<any> {
    var url: string = "http://143.198.91.135:9009/api/v1/business-application/applicationStatus/update?id=" + id + "&status=" + status;
    return this.http.patch(url, "");
  }
}
