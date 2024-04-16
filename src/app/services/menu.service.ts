import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RouteInfo } from '../util/routeInfo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private authService: AuthService) { }

  routes: RouteInfo[] = [
    { path: '/dashboard', title: '', icon: 'insert_chart_outlined', class: '', children: [], visible: false },
    {
      path: '/procurement', title: 'Procurement', icon: 'add_shopping_cart', class: '',
      children: [
        { path: '/project-proposal', title: 'Project Proposal', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getUserName() == "responsivadmin" },
        { path: '/project-proposal-list', title: 'Project Proposal', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getUserName() == "responsivadmin" },
        { path: '/purchase-request', title: 'Purchase Request', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/purchase-request-list', title: 'Purchase Request', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/purchase-request-consolidate', title: 'Consolidate Purchase Request', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/purchase-request-consolidate-list', title: 'Consolidate Purchase Request', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/request-quotation', title: 'Request For Quotation', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/request-quotation-list', title: 'Request For Quotation', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/abstract-of-canvass', title: 'Abstract of Quotation', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/abstract-of-canvass-list', title: 'Abstract of Quotation', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/purchase-order', title: 'Purchase Order', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/purchase-order-list', title: 'Purchase Order', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/inspection-and-acceptance-report', title: 'Acceptance & Inspection Report', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/inspection-and-acceptance-report-list', title: 'Acceptance & Inspection Report', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/inspection-and-acceptance-report-actual', title: 'Delivery Entry', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/inspection-and-acceptance-report-actual-list', title: 'Delivery Entry', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/acknowledgment-receipt-of-equipment', title: 'Acknowledgment Receipt Of Equipment', icon: 'subdirectory_arrow_right', class: '', visible: false },
        { path: '/acknowledgment-receipt-of-equipment-list', title: 'Acknowledgment Receipt Of Equipment', icon: 'subdirectory_arrow_right', class: '', visible: false },
        { path: '/test', title: 'WOABSPC', icon: 'subdirectory_arrow_right', class: '', visible: false },
        { path: '/test', title: 'Check Register', icon: 'subdirectory_arrow_right', class: '', visible: false }
      ], visible: true
    },{
      path: '/inventory', title: 'Inventory', icon: 'table_chart', class: '',
      children: [
        { path: '/delivery-report', title: 'Delivery Report', icon: 'subdirectory_arrow_right', class: '', visible: this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/department-inventory', title: 'Department Inventory', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/inventory-report', title: 'Inventory Report', icon: 'subdirectory_arrow_right', class: '', visible: this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/inventory-property', title: 'Property Inventory', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/medicine-inventory-report', title: 'Medicine Inventory Report', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/medicine-expiration-monitoring', title: 'Medicine Expiration Monitoring', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/app-monitoring-report', title: 'APP Monitoring', icon: 'subdirectory_arrow_right', class: '', visible: true },
      ], visible: true
    },{
      path: '/issuance', title: 'Warehousing', icon: 'account_balance', class: '',
      children: [
        { path: '/requisition-slip', title: 'Requisition Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/requisition-slip-list', title: 'Requisition Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/issuance-slip', title: 'Issuance Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/issuance-slip-list', title: 'Issuance Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/transfer-withdrawal', title: 'Employee Issuance', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/transfer-withdrawal-list', title: 'Employee Issuance', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/barangay-issuance', title: 'Barangay Issuance', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/barangay-issuance-list', title: 'Barangay Issuance', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/inventory-custodian-slip', title: 'Inventory Custodian Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getUserName() == "responsivadmin" },
        { path: '/inventory-custodian-slip-list', title: 'Inventory Custodian Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getUserName() == "responsivadmin" },
        { path: '/acknowledgment-receipt-of-equipment', title: 'Acknowledgement Receipt', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getUserName() == "responsivadmin" },
        { path: '/acknowledgment-receipt-of-equipment-list', title: 'Acknowledgement Receipt', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getUserName() == "responsivadmin" },
        { path: '/waste-material-report', title: 'Waste Material Report', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" && this.authService.getUserName() == "responsivadmin" },
        { path: '/waste-material-report-list', title: 'Waste Material Report', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" && this.authService.getUserName() == "responsivadmin" },
      ], visible: true
    },{
      path: '/maintenance', title: 'Maintenance', icon: 'build', class: '',
      children: [
        { path: '/request-for-inspection', title: 'Request For Inspection', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/request-for-inspection-list', title: 'Request For Inspection', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/request-for-repair', title: 'Request For Repair', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/request-for-repair-list', title: 'Request For Repair', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/property-requisition-slip', title: 'Property Requisition Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/property-requisition-slip-list', title: 'Property Requisition Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/property-accountability-slip', title: 'Property Accountability Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/property-accountability-slip-list', title: 'Property Accountability Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/property-return-slip', title: 'Property Return Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/property-return-slip-list', title: 'Property Return Slip', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/pre-repair-inspection', title: 'Pre-Repair Inspection Report', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/pre-repair-inspection-list', title: 'Pre-Repair Inspection Report', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
        { path: '/post-repair-inspection', title: 'Post-Repair Inspection', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "Entry" },
        { path: '/post-repair-inspection-list', title: 'Post-Repair Inspection', icon: 'subdirectory_arrow_right', class: '', visible: environment.firstLoad == "List" },
      ], visible: this.authService.getUserName() == "responsivadmin"
    },{
      path: '/setup', title: 'General Setting', icon: 'settings', class: '',
      children: [
        { path: '/user-setup', title: 'User Setup', icon: 'supervisor_account', class: '', visible: this.authService.getUserId() == "7be1a062-ec39-4930-b0f6-7e3c0557f2db" || this.authService.getUserId() == "a4af1387-a790-433a-9212-9cb45ac24b9f" },
        { path: '/item-setup', title: 'Item Setup', icon: 'format_list_numbered', class: '', visible: this.authService.getUserId() == "7be1a062-ec39-4930-b0f6-7e3c0557f2db" || this.authService.getUserId() == "a4af1387-a790-433a-9212-9cb45ac24b9f" },
        { path: '/item-setup-user', title: 'Item Setup', icon: 'format_list_numbered', class: '', visible: this.authService.getTypeId() == environment.gsoDeptId.toString() && !(this.authService.getUserId() == "7be1a062-ec39-4930-b0f6-7e3c0557f2db" || this.authService.getUserId() == "a4af1387-a790-433a-9212-9cb45ac24b9f") },
        { path: '/medical-item-setup', title: 'Medical & Dental Item', icon: 'format_list_numbered', class: '', visible: this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/non-inventory-item-setup', title: 'Non-Inventory Item Setup', icon: 'format_list_numbered', class: '', visible: true },
        { path: '/supplier-setup', title: 'Supplier Setup', icon: 'business', class: '', visible: this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/under-development', title: 'Signatory Setup', icon: 'supervisor_account', class: '', visible: this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/unit-conversion', title: 'Unit Conversion', icon: 'straighten', class: '', visible: this.authService.getTypeId() == environment.gsoDeptId.toString() },
        { path: '/morph-entry', title: 'Morph Entry', icon: 'format_list_numbered', class: '', visible: false },
        { path: '/business-application', title: 'Business Application', icon: 'business', class: '', visible: this.authService.getUserName() == "responsivadmin" },
      ], visible: true
    },{
      path: '/reports', title: 'Reports', icon: 'receipt', class: '',
      children: [
        { path: '/property-issued-registry', title: 'Property Issued Registry', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/inventory-transfer', title: 'Inventory Transfer', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/returned-property-receipt', title: 'Returned Property Receipt', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/property-issued-report', title: 'Property Issued Report', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/physical-count-property', title: 'Physical Count Property', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/lsdd-property-report', title: 'LSDD Property Report', icon: 'subdirectory_arrow_right', class: '', visible: true },
        { path: '/unserviceable-property-report', title: 'Unserviceable Property Report', icon: 'subdirectory_arrow_right', class: '', visible: true },
      ], visible: true
    },
  ];
}