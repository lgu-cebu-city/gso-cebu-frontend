import { Routes } from '@angular/router';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { FormsComponent } from '../pages/forms/forms.component';
import { PurchaseRequestComponent } from '../pages/purchase-request/purchase-request.component';
import { PurchaseRequestListComponent } from '../pages/purchase-request/purchaserequestlist/purchaserequestlist.component';
import { AcceptanceAndInspectionReportComponent } from '../pages/acceptance-and-inspection-report/acceptance-and-inspection-report.component';
import { AcknowledgmentReceiptOfEquipmentComponent } from '../pages/acknowledgment-receipt-of-equipment/acknowledgment-receipt-of-equipment.component';
import { ItemComponent } from '../setup/item/item.component';
import { ProjectProposalComponent } from '../pages/project-proposal/project-proposal.component';
import { ProjectProposalListComponent } from '../pages/project-proposal/project-proposal-list/project-proposal-list.component';
import { RequestQuotationComponent } from '../pages/request-quotation/request-quotation.component';
import { RequestQuotationListComponent } from '../pages/request-quotation/request-quotation-list/request-quotation-list.component';
import { AbstractOfCanvassComponent } from '../pages/abstract-of-canvass/abstract-of-canvass.component';
import { AbstractOfCanvassListComponent } from '../pages/abstract-of-canvass/abstract-of-canvass-list/abstract-of-canvass-list.component';
import { PurchaseOrderComponent } from '../pages/purchase-order/purchase-order.component';
import { PurchaseOrderListComponent } from '../pages/purchase-order/purchase-order-list/purchase-order-list.component';
import { InspectionAndAcceptanceReportListComponent } from '../pages/acceptance-and-inspection-report/inspection-and-acceptance-report-list/inspection-and-acceptance-report-list.component';
import { MorphEntryComponent } from '../setup/morph-entry/morph-entry.component';
import { UnitConversionComponent } from '../setup/unit-conversion/unit-conversion.component';
import { InventoryReportComponent } from '../pages/inventory-report/inventory-report.component';
import { RequisitionSlipComponent } from '../pages/requisition-slip/requisition-slip.component';
import { IssuanceSlipComponent } from '../pages/issuance-slip/issuance-slip.component';
import { RequisitionSlipListComponent } from '../pages/requisition-slip/requisition-slip-list/requisition-slip-list.component';
import { InventoryCustodianSlipComponent } from '../pages/inventory-custodian-slip/inventory-custodian-slip.component';
import { TransferWithdrawalComponent } from '../pages/transfer-withdrawal/transfer-withdrawal.component';
import { IssuanceSlipListComponent } from '../pages/issuance-slip/issuance-slip-list/issuance-slip-list.component';
import { TransferWithdrawalListComponent } from '../pages/transfer-withdrawal/transfer-withdrawal-list/transfer-withdrawal-list.component';
import { AcknowledgmentReceiptOfEquipmentListComponent } from '../pages/acknowledgment-receipt-of-equipment/acknowledgment-receipt-of-equipment-list/acknowledgment-receipt-of-equipment-list.component';
import { InventoryPropertyComponent } from '../pages/inventory-property/inventory-property.component';
import { InventoryCustodianSlipListComponent } from '../pages/inventory-custodian-slip/inventory-custodian-slip-list/inventory-custodian-slip-list.component';
import { RequestForInspectionComponent } from '../pages/request-for-inspection/request-for-inspection.component';
import { RequestForInspectionListComponent } from '../pages/request-for-inspection/request-for-inspection-list/request-for-inspection-list.component';
import { RequestForRepairComponent } from '../pages/request-for-repair/request-for-repair.component';
import { RequestForRepairListComponent } from '../pages/request-for-repair/request-for-repair-list/request-for-repair-list.component';
import { WasteMaterialReportComponent } from '../pages/waste-material-report/waste-material-report.component';
import { WasteMaterialReportListComponent } from '../pages/waste-material-report/waste-material-report-list/waste-material-report-list.component';
import { PropertyRequisitionSlipComponent } from '../pages/property-requisition-slip/property-requisition-slip.component';
import { PropertyRequisitionSlipListComponent } from '../pages/property-requisition-slip/property-requisition-slip-list/property-requisition-slip-list.component';
import { PropertyAccountabilitySlipComponent } from '../pages/property-accountability-slip/property-accountability-slip.component';
import { PropertyAccountabilitySlipListComponent } from '../pages/property-accountability-slip/property-accountability-slip-list/property-accountability-slip-list.component';
import { PropertyReturnSlipListComponent } from '../pages/property-return-slip/property-return-slip-list/property-return-slip-list.component';
import { PropertyReturnSlipComponent } from '../pages/property-return-slip/property-return-slip.component';
import { SupplierComponent } from '../setup/supplier/supplier.component';
import { SignatoryComponent } from '../setup/signatory/signatory.component';
import { UnderDevelopmentComponent } from '../under-development/under-development.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { MedicineInventoryReportComponent } from '../pages/medicine-inventory-report/medicine-inventory-report.component';
import { MedicineExpirationMonitoringComponent } from '../pages/medicine-expiration-monitoring/medicine-expiration-monitoring.component';
import { RequisitionIssuanceSlipComponent } from '../pages/requisition-issuance-slip/requisition-issuance-slip.component';
import { RequisitionIssuanceSlipListComponent } from '../pages/requisition-issuance-slip/requisition-issuance-slip-list/requisition-issuance-slip-list.component';
import { BarangayIssuanceComponent } from '../pages/barangay-issuance/barangay-issuance.component';
import { BarangayIssuanceListComponent } from '../pages/barangay-issuance/barangay-issuance-list/barangay-issuance-list.component';
import { PropertyIssuedRegistryComponent } from '../reports/property-issued-registry/property-issued-registry.component';
import { InventoryTransferComponent } from '../reports/inventory-transfer/inventory-transfer.component';
import { ReturnedPropertyReceiptComponent } from '../reports/returned-property-receipt/returned-property-receipt.component';
import { PropertyIssuedReportComponent } from '../reports/property-issued-report/property-issued-report.component';
import { PhysicalCountPropertyComponent } from '../reports/physical-count-property/physical-count-property.component';
import { LsddPropertyReportComponent } from '../reports/lsdd-property-report/lsdd-property-report.component';
import { UnserviceablePropertyReportComponent } from '../reports/unserviceable-property-report/unserviceable-property-report.component';
import { PurchaseRequestConsolidateComponent } from '../pages/purchase-request-consolidate/purchase-request-consolidate.component';
import { PurchaseRequestConsolidateListComponent } from '../pages/purchase-request-consolidate/purchase-request-consolidate-list/purchase-request-consolidate-list.component';
import { UserSetupComponent } from '../setup/user-setup/user-setup.component';
import { DeliveryReportComponent } from '../pages/delivery-report/delivery-report.component';
import { AppMonitoringReportComponent } from '../pages/app-monitoring-report/app-monitoring-report.component';
import { NonInventoryItemComponent } from '../setup/non-inventory-item/non-inventory-item.component';
import { ItemMedicalComponent } from '../setup/item-medical/item-medical.component';
import { InspectionAndAcceptanceReportActualListComponent } from '../pages/inspection-and-acceptance-report-actual/inspection-and-acceptance-report-actual-list/inspection-and-acceptance-report-actual-list.component';
import { InspectionAndAcceptanceReportActualComponent } from '../pages/inspection-and-acceptance-report-actual/inspection-and-acceptance-report-actual.component';
import { DepartmentInventoryComponent } from '../pages/department-inventory/department-inventory.component';
import { ItemUserComponent } from '../setup/item-user/item-user.component';
import { PreRepairInspectionComponent } from '../pages/pre-repair-inspection/pre-repair-inspection.component';
import { PreRepairInspectionListComponent } from '../pages/pre-repair-inspection/pre-repair-inspection-list/pre-repair-inspection-list.component';
import { PostRepairInspectionComponent } from '../pages/post-repair-inspection/post-repair-inspection.component';
import { PostRepairInspectionListComponent } from '../pages/post-repair-inspection/post-repair-inspection-list/post-repair-inspection-list.component';
import { BusinessApplicationComponent } from '../pages/business-application/business-application.component';

export const MainLayoutRoutes: Routes = [
  { path: 'user-setup', component: UserSetupComponent },
  { path: 'under-development', component: UnderDevelopmentComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'item-setup', component: ItemComponent },
  { path: 'item-setup-user', component: ItemUserComponent },
  { path: 'medical-item-setup', component: ItemMedicalComponent },
  { path: 'non-inventory-item-setup', component: NonInventoryItemComponent },
  { path: 'supplier-setup', component: SupplierComponent },
  { path: 'signatory-setup', component: SignatoryComponent },
  { path: 'unit-conversion', component: UnitConversionComponent },
  { path: 'morph-entry', component: MorphEntryComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'purchase-request', component: PurchaseRequestComponent },
  { path: 'purchase-request-list', component: PurchaseRequestListComponent },
  { path: 'purchase-request-consolidate', component: PurchaseRequestConsolidateComponent },
  { path: 'purchase-request-consolidate-list', component: PurchaseRequestConsolidateListComponent },
  { path: 'app-monitoring-report', component: AppMonitoringReportComponent },
  { path: 'inspection-and-acceptance-report', component: AcceptanceAndInspectionReportComponent },
  { path: 'inspection-and-acceptance-report-list', component: InspectionAndAcceptanceReportListComponent },
  { path: 'inspection-and-acceptance-report-actual', component: InspectionAndAcceptanceReportActualComponent },
  { path: 'inspection-and-acceptance-report-actual-list', component: InspectionAndAcceptanceReportActualListComponent },
  { path: 'acknowledgment-receipt-of-equipment', component: AcknowledgmentReceiptOfEquipmentComponent },
  { path: 'acknowledgment-receipt-of-equipment-list', component: AcknowledgmentReceiptOfEquipmentListComponent },
  { path: 'project-proposal', component: ProjectProposalComponent},
  { path: 'project-proposal-list', component: ProjectProposalListComponent},
  { path: 'request-quotation', component: RequestQuotationComponent},
  { path: 'request-quotation-list', component: RequestQuotationListComponent},
  { path: 'abstract-of-canvass', component: AbstractOfCanvassComponent},
  { path: 'abstract-of-canvass-list', component: AbstractOfCanvassListComponent},
  { path: 'purchase-order', component: PurchaseOrderComponent },
  { path: 'purchase-order-list', component: PurchaseOrderListComponent },
  { path: 'delivery-report', component: DeliveryReportComponent },
  { path: 'department-inventory', component: DepartmentInventoryComponent },
  { path: 'inventory-report', component: InventoryReportComponent },
  { path: 'inventory-property', component: InventoryPropertyComponent },
  { path: 'medicine-inventory-report', component: MedicineInventoryReportComponent },
  { path: 'medicine-expiration-monitoring', component: MedicineExpirationMonitoringComponent },
  { path: 'requisition-slip', component: RequisitionSlipComponent },
  { path: 'requisition-slip-list', component: RequisitionSlipListComponent },
  { path: 'issuance-slip', component: IssuanceSlipComponent },
  { path: 'issuance-slip-list', component: IssuanceSlipListComponent },
  { path: 'requisition-issuance-slip', component: RequisitionIssuanceSlipComponent },
  { path: 'requisition-issuance-slip-list', component: RequisitionIssuanceSlipListComponent },
  { path: 'transfer-withdrawal', component: TransferWithdrawalComponent },
  { path: 'transfer-withdrawal-list', component: TransferWithdrawalListComponent },
  { path: 'barangay-issuance', component: BarangayIssuanceComponent },
  { path: 'barangay-issuance-list', component: BarangayIssuanceListComponent },
  { path: 'inventory-custodian-slip', component: InventoryCustodianSlipComponent },
  { path: 'inventory-custodian-slip-list', component: InventoryCustodianSlipListComponent },
  { path: 'request-for-inspection', component: RequestForInspectionComponent },
  { path: 'request-for-inspection-list', component: RequestForInspectionListComponent },
  { path: 'request-for-repair', component: RequestForRepairComponent },
  { path: 'request-for-repair-list', component: RequestForRepairListComponent },
  { path: 'waste-material-report', component: WasteMaterialReportComponent },
  { path: 'waste-material-report-list', component: WasteMaterialReportListComponent },
  { path: 'property-requisition-slip', component: PropertyRequisitionSlipComponent },
  { path: 'property-requisition-slip-list', component: PropertyRequisitionSlipListComponent },
  { path: 'property-accountability-slip', component: PropertyAccountabilitySlipComponent },
  { path: 'property-accountability-slip-list', component: PropertyAccountabilitySlipListComponent },
  { path: 'property-return-slip', component: PropertyReturnSlipComponent },
  { path: 'property-return-slip-list', component: PropertyReturnSlipListComponent },
  { path: 'property-issued-registry', component: PropertyIssuedRegistryComponent },
  { path: 'inventory-transfer', component: InventoryTransferComponent },
  { path: 'returned-property-receipt', component: ReturnedPropertyReceiptComponent },
  { path: 'property-issued-report', component: PropertyIssuedReportComponent },
  { path: 'physical-count-property', component: PhysicalCountPropertyComponent },
  { path: 'lsdd-property-report', component: LsddPropertyReportComponent },
  { path: 'unserviceable-property-report', component: UnserviceablePropertyReportComponent },
  { path: 'pre-repair-inspection', component: PreRepairInspectionComponent },
  { path: 'pre-repair-inspection-list', component: PreRepairInspectionListComponent },
  { path: 'post-repair-inspection', component: PostRepairInspectionComponent },
  { path: 'post-repair-inspection-list', component: PostRepairInspectionListComponent },
  { path: 'business-application', component: BusinessApplicationComponent },
];
