import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MaterialModule } from '../../angular-material.module';
import { MainLayoutRoutes } from './main-layout.routing';
import { FormHeaderComponent } from '../header/form-header/form-header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxPrintModule } from 'ngx-print';

import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';

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
import { SupplierDetailsComponent } from '../pages/abstract-of-canvass/supplier-details/supplier-details.component';
import { PurchaseOrderComponent } from '../pages/purchase-order/purchase-order.component';
import { PurchaseOrderListComponent } from '../pages/purchase-order/purchase-order-list/purchase-order-list.component';
import { InspectionAndAcceptanceReportListComponent } from '../pages/acceptance-and-inspection-report/inspection-and-acceptance-report-list/inspection-and-acceptance-report-list.component';
import { ProjectProposalPrintComponent } from '../pages/project-proposal/project-proposal-print/project-proposal-print.component';
import { PrintHeaderComponent } from '../header/print-header/print-header.component';
import { PurchaseRequestPrintComponent } from '../pages/purchase-request/purchase-request-print/purchase-request-print.component';
import { PurchaseOrderPrintComponent } from '../pages/purchase-order/purchase-order-print/purchase-order-print.component';
import { MorphEntryComponent } from '../setup/morph-entry/morph-entry.component';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FundListDialogComponent } from '../pages/project-proposal/fund-list-dialog/fund-list-dialog.component';
import { RequestQuotationPrintComponent } from '../pages/request-quotation/request-quotation-print/request-quotation-print.component';
import { AbstractOfCanvassPrintAwardComponent } from '../pages/abstract-of-canvass/abstract-of-canvass-print-award/abstract-of-canvass-print-award.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { UnitConversionComponent } from '../setup/unit-conversion/unit-conversion.component';
import { CanvassSelectionDialogComponent } from '../pages/purchase-order/canvass-selection-dialog/canvass-selection-dialog.component';
import { InspectionAndAcceptanceReportPrintComponent } from '../pages/acceptance-and-inspection-report/inspection-and-acceptance-report-print/inspection-and-acceptance-report-print.component';
import { InventoryReportComponent } from '../pages/inventory-report/inventory-report.component';
import { StockCardPrintComponent } from '../pages/inventory-report/stock-card-print/stock-card-print.component';
import { InventoryReportPrintComponent } from '../pages/inventory-report/inventory-report-print/inventory-report-print.component';
import { RequisitionSlipComponent } from '../pages/requisition-slip/requisition-slip.component';
import { IssuanceSlipComponent } from '../pages/issuance-slip/issuance-slip.component';
import { RisItemDetailsDialogComponent } from '../pages/requisition-slip/ris-item-details-dialog/ris-item-details-dialog.component';
import { RequisitionSlipListComponent } from '../pages/requisition-slip/requisition-slip-list/requisition-slip-list.component';
import { InventoryCustodianSlipComponent } from '../pages/inventory-custodian-slip/inventory-custodian-slip.component';
import { TransferWithdrawalComponent } from '../pages/transfer-withdrawal/transfer-withdrawal.component';
import { InventoryCustodianSlipPrintComponent } from '../pages/inventory-custodian-slip/inventory-custodian-slip-print/inventory-custodian-slip-print.component';
import { IssuanceSlipListComponent } from '../pages/issuance-slip/issuance-slip-list/issuance-slip-list.component';
import { TransferWithdrawalListComponent } from '../pages/transfer-withdrawal/transfer-withdrawal-list/transfer-withdrawal-list.component';
import { TransferWithdrawalPrintComponent } from '../pages/transfer-withdrawal/transfer-withdrawal-print/transfer-withdrawal-print.component';
import { IssuanceSlipPrintComponent } from '../pages/issuance-slip/issuance-slip-print/issuance-slip-print.component';
import { AcknowledgmentReceiptOfEquipmentListComponent } from '../pages/acknowledgment-receipt-of-equipment/acknowledgment-receipt-of-equipment-list/acknowledgment-receipt-of-equipment-list.component';
import { AcknowledgmentReceiptOfEquipmentPrintComponent } from '../pages/acknowledgment-receipt-of-equipment/acknowledgment-receipt-of-equipment-print/acknowledgment-receipt-of-equipment-print.component';
import { SsmiPrintComponent } from '../pages/inventory-report/ssmi-print/ssmi-print.component';
import { InventoryPropertyComponent } from '../pages/inventory-property/inventory-property.component';
import { PropertyCardPrintComponent } from '../pages/inventory-property/property-card-print/property-card-print.component';
import { InventoryCustodianSlipListComponent } from '../pages/inventory-custodian-slip/inventory-custodian-slip-list/inventory-custodian-slip-list.component';
import { RequestForInspectionComponent } from '../pages/request-for-inspection/request-for-inspection.component';
import { RequestForInspectionListComponent } from '../pages/request-for-inspection/request-for-inspection-list/request-for-inspection-list.component';
import { RequestForInspectionPrintComponent } from '../pages/request-for-inspection/request-for-inspection-print/request-for-inspection-print.component';
import { RequestForRepairComponent } from '../pages/request-for-repair/request-for-repair.component';
import { RequestForRepairListComponent } from '../pages/request-for-repair/request-for-repair-list/request-for-repair-list.component';
import { RequestForRepairPrintComponent } from '../pages/request-for-repair/request-for-repair-print/request-for-repair-print.component';
import { WasteMaterialReportComponent } from '../pages/waste-material-report/waste-material-report.component';
import { WasteMaterialReportListComponent } from '../pages/waste-material-report/waste-material-report-list/waste-material-report-list.component';
import { WasteMaterialReportPrintComponent } from '../pages/waste-material-report/waste-material-report-print/waste-material-report-print.component';
import { PropertyRequisitionSlipComponent } from '../pages/property-requisition-slip/property-requisition-slip.component';
import { PropertyRequisitionSlipListComponent } from '../pages/property-requisition-slip/property-requisition-slip-list/property-requisition-slip-list.component';
import { PropertyAccountabilitySlipComponent } from '../pages/property-accountability-slip/property-accountability-slip.component';
import { PropertyAccountabilitySlipListComponent } from '../pages/property-accountability-slip/property-accountability-slip-list/property-accountability-slip-list.component';
import { PropertyReturnSlipListComponent } from '../pages/property-return-slip/property-return-slip-list/property-return-slip-list.component';
import { PropertyReturnSlipComponent } from '../pages/property-return-slip/property-return-slip.component';
import { PropertyRequisitionSlipPrintComponent } from '../pages/property-requisition-slip/property-requisition-slip-print/property-requisition-slip-print.component';
import { PropertyAccountabilitySlipPrintComponent } from '../pages/property-accountability-slip/property-accountability-slip-print/property-accountability-slip-print.component';
import { PropertyReturnSlipPrintComponent } from '../pages/property-return-slip/property-return-slip-print/property-return-slip-print.component';
import { SupplierComponent } from '../setup/supplier/supplier.component';
import { SignatoryComponent } from '../setup/signatory/signatory.component';
import { UnderDevelopmentComponent } from '../under-development/under-development.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { MedicineInventoryReportComponent } from '../pages/medicine-inventory-report/medicine-inventory-report.component';
import { MedicineExpirationMonitoringComponent } from '../pages/medicine-expiration-monitoring/medicine-expiration-monitoring.component';
import { RequisitionIssuanceSlipComponent } from '../pages/requisition-issuance-slip/requisition-issuance-slip.component';
import { RequisitionIssuanceSlipListComponent } from '../pages/requisition-issuance-slip/requisition-issuance-slip-list/requisition-issuance-slip-list.component';
import { MedicineExpirationMonitoringPrintComponent } from '../pages/medicine-expiration-monitoring/medicine-expiration-monitoring-print/medicine-expiration-monitoring-print.component';
import { BarangayIssuanceComponent } from '../pages/barangay-issuance/barangay-issuance.component';
import { BarangayIssuanceListComponent } from '../pages/barangay-issuance/barangay-issuance-list/barangay-issuance-list.component';
import { BarangayIssuancePrintComponent } from '../pages/barangay-issuance/barangay-issuance-print/barangay-issuance-print.component';
import { Annex1Component } from '../pages/coa-reports/annex1/annex1.component';
import { Annex2Component } from '../pages/coa-reports/annex2/annex2.component';
import { Annex3Component } from '../pages/coa-reports/annex3/annex3.component';
import { Annex4Component } from '../pages/coa-reports/annex4/annex4.component';
import { Annex5Component } from '../pages/coa-reports/annex5/annex5.component';
import { Annex6Component } from '../pages/coa-reports/annex6/annex6.component';
import { Annex7Component } from '../pages/coa-reports/annex7/annex7.component';
import { Annex8Component } from '../pages/coa-reports/annex8/annex8.component';
import { Annex9Component } from '../pages/coa-reports/annex9/annex9.component';
import { Annex10Component } from '../pages/coa-reports/annex10/annex10.component';
import { PropertyIssuedRegistryComponent } from '../reports/property-issued-registry/property-issued-registry.component';
import { InventoryTransferComponent } from '../reports/inventory-transfer/inventory-transfer.component';
import { ReturnedPropertyReceiptComponent } from '../reports/returned-property-receipt/returned-property-receipt.component';
import { PropertyIssuedReportComponent } from '../reports/property-issued-report/property-issued-report.component';
import { PhysicalCountPropertyComponent } from '../reports/physical-count-property/physical-count-property.component';
import { LsddPropertyReportComponent } from '../reports/lsdd-property-report/lsdd-property-report.component';
import { UnserviceablePropertyReportComponent } from '../reports/unserviceable-property-report/unserviceable-property-report.component';
import { PurchaseRequestLogsComponent } from '../pages/purchase-request/purchase-request-logs/purchase-request-logs.component';
import { PurchaseRequestConsolidateComponent } from '../pages/purchase-request-consolidate/purchase-request-consolidate.component';
import { PurchaseRequestConsolidateListComponent } from '../pages/purchase-request-consolidate/purchase-request-consolidate-list/purchase-request-consolidate-list.component';
import { UserSetupComponent } from '../setup/user-setup/user-setup.component';
import { AbstractOfCanvassPrintComponent } from '../pages/abstract-of-canvass/abstract-of-canvass-print/abstract-of-canvass-print.component';
import { CanvassSheetPrintComponent } from '../pages/request-quotation/canvass-sheet-print/canvass-sheet-print.component';
import { DeliveryReportComponent } from '../pages/delivery-report/delivery-report.component';
import { DeliveryReportPrintComponent } from '../pages/delivery-report/delivery-report-print/delivery-report-print.component';
import { DeliveryReportSummaryPrintComponent } from '../pages/delivery-report/delivery-report-summary-print/delivery-report-summary-print.component';
import { AppMonitoringReportComponent } from '../pages/app-monitoring-report/app-monitoring-report.component';
import { AppMonitoringReportPrintComponent } from '../pages/app-monitoring-report/app-monitoring-report-print/app-monitoring-report-print.component';
import { PrListItemsComponent } from '../pages/purchase-request/purchaserequestlist/pr-list-items/pr-list-items.component';
import { PurchaseRequestAprPrintComponent } from '../pages/purchase-request-consolidate/purchase-request-apr-print/purchase-request-apr-print.component';
import { PurchaseRequestConsolidatePrintComponent } from '../pages/purchase-request-consolidate/purchase-request-consolidate-print/purchase-request-consolidate-print.component';
import { PrintPreviewPrComponent } from '../pages/purchase-request/print-preview-pr/print-preview-pr.component';
import { PrintPreviewPrConsolidateComponent } from '../pages/purchase-request-consolidate/print-preview-pr-consolidate/print-preview-pr-consolidate.component';
import { ItemPrintComponent } from '../setup/item/item-print/item-print.component';
import { PrintPreviewRfqComponent } from '../pages/request-quotation/print-preview-rfq/print-preview-rfq.component';
import { PrintPreviewCanvassSheetComponent } from '../pages/request-quotation/print-preview-canvass-sheet/print-preview-canvass-sheet.component';
import { PreviewSelectionRfqComponent } from '../pages/request-quotation/preview-selection-rfq/preview-selection-rfq.component';
import { PrintPreviewAocComponent } from '../pages/abstract-of-canvass/print-preview-aoc/print-preview-aoc.component';
import { NonInventoryItemComponent } from '../setup/non-inventory-item/non-inventory-item.component';
import { PrintPreviewPoComponent } from '../pages/purchase-order/print-preview-po/print-preview-po.component';
import { AoqPrintComponent } from '../pages/abstract-of-canvass/aoq-print/aoq-print.component';
import { RfqPrintComponent } from '../pages/request-quotation/rfq-print/rfq-print.component';
import { IarPrintComponent } from '../pages/acceptance-and-inspection-report/iar-print/iar-print.component';
import { PrintPreviewIarComponent } from '../pages/acceptance-and-inspection-report/print-preview-iar/print-preview-iar.component';
import { IarListItemsComponent } from '../pages/acceptance-and-inspection-report/inspection-and-acceptance-report-list/iar-list-items/iar-list-items.component';
import { ItemMedicalComponent } from '../setup/item-medical/item-medical.component';
import { AobPrintComponent } from '../pages/abstract-of-canvass/aob-print/aob-print.component';
import { PrintPreviewAobComponent } from '../pages/abstract-of-canvass/print-preview-aob/print-preview-aob.component';
import { InspectionAndAcceptanceReportActualComponent } from '../pages/inspection-and-acceptance-report-actual/inspection-and-acceptance-report-actual.component';
import { InspectionAndAcceptanceReportActualListComponent } from '../pages/inspection-and-acceptance-report-actual/inspection-and-acceptance-report-actual-list/inspection-and-acceptance-report-actual-list.component';
import { DepartmentInventoryComponent } from '../pages/department-inventory/department-inventory.component';
import { ItemUserComponent } from '../setup/item-user/item-user.component';
import { PreRepairInspectionComponent } from '../pages/pre-repair-inspection/pre-repair-inspection.component';
import { PreRepairInspectionListComponent } from '../pages/pre-repair-inspection/pre-repair-inspection-list/pre-repair-inspection-list.component';
import { PreRepairInspectionPrintComponent } from '../pages/pre-repair-inspection/pre-repair-inspection-print/pre-repair-inspection-print.component';
import { PostRepairInspectionComponent } from '../pages/post-repair-inspection/post-repair-inspection.component';
import { PostRepairInspectionPrintComponent } from '../pages/post-repair-inspection/post-repair-inspection-print/post-repair-inspection-print.component';
import { PostRepairInspectionListComponent } from '../pages/post-repair-inspection/post-repair-inspection-list/post-repair-inspection-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MainLayoutRoutes),
    FormsModule,
    OverlayModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxPrintModule,
    CurrencyMaskModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [
    UserSetupComponent,
    UnderDevelopmentComponent,
    PageNotFoundComponent,
    ItemComponent,
    ItemUserComponent,
    ItemMedicalComponent,
    NonInventoryItemComponent,
    ItemPrintComponent,
    SupplierComponent,
    SignatoryComponent,
    UnitConversionComponent,
    MorphEntryComponent,
    PurchaseRequestComponent,
    PurchaseRequestListComponent,
    PrListItemsComponent,
    PurchaseRequestPrintComponent,
    PurchaseRequestLogsComponent,
    PurchaseRequestConsolidateComponent,
    PurchaseRequestConsolidateListComponent,
    PurchaseRequestConsolidatePrintComponent,
    PurchaseRequestAprPrintComponent,
    PrintPreviewPrComponent,
    PrintPreviewPrConsolidateComponent,
    AppMonitoringReportComponent,
    AppMonitoringReportPrintComponent,
    FormHeaderComponent,
    PrintHeaderComponent,
    AcceptanceAndInspectionReportComponent,
    InspectionAndAcceptanceReportListComponent,
    InspectionAndAcceptanceReportPrintComponent,
    InspectionAndAcceptanceReportActualComponent,
    InspectionAndAcceptanceReportActualListComponent,
    IarListItemsComponent,
    PrintPreviewIarComponent,
    IarPrintComponent,
    AcknowledgmentReceiptOfEquipmentComponent,
    AcknowledgmentReceiptOfEquipmentListComponent,
    AcknowledgmentReceiptOfEquipmentPrintComponent,
    ProjectProposalComponent,
    ProjectProposalListComponent,
    FundListDialogComponent,
    ProjectProposalPrintComponent,
    RequestQuotationComponent,
    RequestQuotationListComponent,
    RequestQuotationPrintComponent,
    RfqPrintComponent,
    PreviewSelectionRfqComponent,
    PrintPreviewRfqComponent,
    PrintPreviewCanvassSheetComponent,
    AbstractOfCanvassComponent,
    AbstractOfCanvassListComponent,
    AbstractOfCanvassPrintAwardComponent,
    AbstractOfCanvassPrintComponent,
    AoqPrintComponent,
    AobPrintComponent,
    PrintPreviewAocComponent,
    PrintPreviewAobComponent,
    CanvassSheetPrintComponent,
    SupplierDetailsComponent,
    PurchaseOrderComponent,
    PurchaseOrderListComponent,
    PurchaseOrderPrintComponent,
    PrintPreviewPoComponent,
    DeliveryReportComponent,
    DeliveryReportPrintComponent,
    DeliveryReportSummaryPrintComponent,
    CanvassSelectionDialogComponent,
    InventoryReportComponent,
    InventoryReportPrintComponent,
    DepartmentInventoryComponent,
    MedicineInventoryReportComponent,
    MedicineExpirationMonitoringComponent,
    MedicineExpirationMonitoringPrintComponent,
    StockCardPrintComponent,
    SsmiPrintComponent,
    RequisitionSlipComponent,
    RequisitionSlipListComponent,
    IssuanceSlipComponent,
    IssuanceSlipListComponent,
    IssuanceSlipPrintComponent,
    RequisitionIssuanceSlipComponent,
    RequisitionIssuanceSlipListComponent,
    RisItemDetailsDialogComponent,
    InventoryCustodianSlipComponent,
    InventoryCustodianSlipListComponent,
    InventoryCustodianSlipPrintComponent,
    TransferWithdrawalComponent,
    TransferWithdrawalListComponent,
    TransferWithdrawalPrintComponent,
    BarangayIssuanceComponent,
    BarangayIssuanceListComponent,
    BarangayIssuancePrintComponent,
    InventoryPropertyComponent,
    PropertyCardPrintComponent,
    RequestForInspectionComponent,
    RequestForInspectionListComponent,
    RequestForInspectionPrintComponent,
    RequestForRepairComponent,
    RequestForRepairListComponent,
    RequestForRepairPrintComponent,
    WasteMaterialReportComponent,
    WasteMaterialReportListComponent,
    WasteMaterialReportPrintComponent,
    PropertyRequisitionSlipComponent,
    PropertyRequisitionSlipListComponent,
    PropertyAccountabilitySlipComponent,
    PropertyAccountabilitySlipListComponent,
    PropertyReturnSlipComponent,
    PropertyReturnSlipListComponent,
    PropertyRequisitionSlipPrintComponent,
    PropertyAccountabilitySlipPrintComponent,
    PropertyReturnSlipPrintComponent,
    PreRepairInspectionComponent,
    PreRepairInspectionListComponent,
    PreRepairInspectionPrintComponent,
    PostRepairInspectionComponent,
    PostRepairInspectionPrintComponent,
    PostRepairInspectionListComponent,
    Annex1Component, // SEMI EXPENDABLE PROPERTY CARD
    Annex2Component, // SEMI-EXPENDABLE PROPERTY LEDGER CARD
    Annex3Component, // INVENTORY CUSTODIAN SLIP
    Annex4Component, // REGISTRY OF SEMI-EXPENDABLE PROPERTY ISSUED
    Annex5Component, // INVENTORY TRANSFER REPORT
    Annex6Component, // RECEIPT OF RETURNED SEMI-EXPANDABLE PROPERTY
    Annex7Component, // REPORT OF SEMI-EXPENDABLE PROPERTY ISSUED
    Annex8Component, // REPORT ON THE PHYSICAL COUNT OF SEMI-EXPENDABLE PROPERTY
    Annex9Component, // REPORT OF LOST, STOLEN, DAMAGED OR DESTROYED SEMI-EXPENDABLE PROPERTY
    Annex10Component, // INVENTORY AND INSPECTION REPORT OF UNSERVICEABLE SEMI-EXPANDABLE PROPERTY
    PropertyIssuedRegistryComponent,
    InventoryTransferComponent,
    ReturnedPropertyReceiptComponent,
    PropertyIssuedReportComponent,
    PhysicalCountPropertyComponent,
    LsddPropertyReportComponent,
    UnserviceablePropertyReportComponent,
  ]
})

export class AdminLayoutModule { }
