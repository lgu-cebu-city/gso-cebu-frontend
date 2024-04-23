import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'src/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsComponent } from './pages/forms/forms.component';
import { SideBarService } from './sidebar/sidebar.service';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ItemDetailsDialogComponent } from './pages/project-proposal/item-details-dialog/item-details-dialog.component';
import { PpSelectionDialogComponent } from './pages/purchase-request/pp-selection-dialog/pp-selection-dialog.component';
import { PrSelectionDialogComponent } from './pages/request-quotation/pr-selection-dialog/pr-selection-dialog.component';
import { RfqSelectionDialogComponent } from './pages/abstract-of-canvass/rfq-selection-dialog/rfq-selection-dialog.component';
import { AwardDialogComponent } from './pages/abstract-of-canvass/abstract-of-canvass-list/award-dialog/award-dialog.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { PoSelectionDialogComponent } from './pages/acceptance-and-inspection-report/po-selection-dialog/po-selection-dialog.component';
import { IssuanceSelectionDialogComponent } from './pages/issuance-slip/issuance-selection-dialog/issuance-selection-dialog.component';
import { ItemSetupDialogComponent } from './pages/acceptance-and-inspection-report/item-setup-dialog/item-setup-dialog.component';
import { AddItemDialogComponent } from './pages/acceptance-and-inspection-report/add-item-dialog/add-item-dialog.component';
import { ListItemDialogComponent } from './pages/acceptance-and-inspection-report/list-item-dialog/list-item-dialog.component';
import { ListItemRisDialogComponent } from './pages/requisition-slip/list-item-ris-dialog/list-item-ris-dialog.component';
import { TransferSelectionDialogComponent } from './pages/transfer-withdrawal/transfer-selection-dialog/transfer-selection-dialog.component';
import { UnitSelectionDialogComponent } from './pages/transfer-withdrawal/unit-selection-dialog/unit-selection-dialog.component';
import { ListItemPpDialogComponent } from './pages/project-proposal/list-item-pp-dialog/list-item-pp-dialog.component';
import { IarListSelectionComponent } from './pages/acknowledgment-receipt-of-equipment/iar-list-selection/iar-list-selection.component';
import { AreAddItemDialogComponent } from './pages/acknowledgment-receipt-of-equipment/are-add-item-dialog/are-add-item-dialog.component';
import { IarListSelectionIcsComponent } from './pages/inventory-custodian-slip/iar-list-selection-ics/iar-list-selection-ics.component';
import { IcsAddItemDialogComponent } from './pages/inventory-custodian-slip/ics-add-item-dialog/ics-add-item-dialog.component';
import { AreItemsSelectionDialogComponent } from './pages/request-for-inspection/are-items-selection-dialog/are-items-selection-dialog.component';
import { RfiItemDetailDialogComponent } from './pages/request-for-inspection/rfi-item-detail-dialog/rfi-item-detail-dialog.component';
import { RfiInspectionTypeSelectionDialogComponent } from './pages/request-for-inspection/rfi-inspection-type-selection-dialog/rfi-inspection-type-selection-dialog.component';
import { RfrItemDetailDialogComponent } from './pages/request-for-repair/rfr-item-detail-dialog/rfr-item-detail-dialog.component';
import { CertificateInspectionEntryDialogComponent } from './pages/waste-material-report/certificate-inspection-entry-dialog/certificate-inspection-entry-dialog.component';
import { WmrItemDetailDialogComponent } from './pages/waste-material-report/wmr-item-detail-dialog/wmr-item-detail-dialog.component';
import { RfiInspectionResultDialogComponent } from './pages/request-for-inspection/rfi-inspection-result-dialog/rfi-inspection-result-dialog.component';
import { RfrRepairResultDialogComponent } from './pages/request-for-repair/rfr-repair-result-dialog/rfr-repair-result-dialog.component';
import { PropreqSelectionDialogComponent } from './pages/property-accountability-slip/propreq-selection-dialog/propreq-selection-dialog.component';
import { PropaccSelectionDialogComponent } from './pages/property-return-slip/propacc-selection-dialog/propacc-selection-dialog.component';
import { InventoryItemSelectionComponent } from './pages/issuance-slip/inventory-item-selection/inventory-item-selection.component';
import { BriItemSelectionComponent } from './pages/barangay-issuance/bri-item-selection/bri-item-selection.component';
import { ReportSelectionComponent } from './report-selection/report-selection.component';
import { AppSelectionDialogComponent } from './pages/purchase-request/app-selection-dialog/app-selection-dialog.component';
import { EmployeeSelectionComponent } from './employee-selection/employee-selection.component';
import { PrSelectionDialogConsolidateComponent } from './pages/purchase-request-consolidate/pr-selection-dialog-consolidate/pr-selection-dialog-consolidate.component';
import { PurchaseRequestAttachmentComponent } from './pages/purchase-request/purchase-request-attachment/purchase-request-attachment.component';
import { PrItemDetailsDialogComponent } from './pages/purchase-request/pr-item-details-dialog/pr-item-details-dialog.component';
import { PrListItemDialogComponent } from './pages/purchase-request/pr-list-item-dialog/pr-list-item-dialog.component';
import { ConfirmationDialogComponent } from './navbar/confirmation-dialog/confirmation-dialog.component';
import { RfqListItemsComponent } from './pages/request-quotation/request-quotation-list/rfq-list-items/rfq-list-items.component';
import { CanvassSelectionItemsDialogComponent } from './pages/purchase-order/canvass-selection-dialog/canvass-selection-items-dialog/canvass-selection-items-dialog.component';
import { PoListItemsComponent } from './pages/purchase-order/purchase-order-list/po-list-items/po-list-items.component';
import { PrSelectionDialogPoComponent } from './pages/purchase-order/pr-selection-dialog-po/pr-selection-dialog-po.component';
import { RisPrSelectionDialogComponent } from './pages/requisition-slip/ris-pr-selection-dialog/ris-pr-selection-dialog.component';
import { TwItemSelectionDialogComponent } from './pages/transfer-withdrawal/tw-item-selection-dialog/tw-item-selection-dialog.component';
import { ActualPoSelectionDialogComponent } from './pages/inspection-and-acceptance-report-actual/actual-po-selection-dialog/actual-po-selection-dialog.component';
import { WmrItemSelectionDialogComponent } from './pages/waste-material-report/wmr-item-selection-dialog/wmr-item-selection-dialog.component';
import { PoriSelectionDialogComponent } from './pages/waste-material-report/pori-selection-dialog/pori-selection-dialog.component';
import { PriSelectionDialogComponent } from './pages/post-repair-inspection/pri-selection-dialog/pri-selection-dialog.component';
import { PreRepairItemDetailsDialogComponent } from './pages/pre-repair-inspection/pre-repair-item-details-dialog/pre-repair-item-details-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    NavbarComponent,
    DashboardComponent,
    FormsComponent,
    ItemDetailsDialogComponent,
    PpSelectionDialogComponent,
    PrSelectionDialogComponent,
    RfqSelectionDialogComponent,
    AwardDialogComponent,
    PoSelectionDialogComponent,
    IssuanceSelectionDialogComponent,
    ItemSetupDialogComponent,
    AddItemDialogComponent,
    ListItemDialogComponent,
    ListItemRisDialogComponent,
    TransferSelectionDialogComponent,
    UnitSelectionDialogComponent,
    ListItemPpDialogComponent,
    IarListSelectionComponent,
    AreAddItemDialogComponent,
    IarListSelectionIcsComponent,
    IcsAddItemDialogComponent,
    AreItemsSelectionDialogComponent,
    RfiItemDetailDialogComponent,
    RfiInspectionTypeSelectionDialogComponent,
    RfrItemDetailDialogComponent,
    CertificateInspectionEntryDialogComponent,
    WmrItemDetailDialogComponent,
    WmrItemSelectionDialogComponent,
    RfiInspectionResultDialogComponent,
    RfrRepairResultDialogComponent,
    PropreqSelectionDialogComponent,
    PropaccSelectionDialogComponent,
    InventoryItemSelectionComponent,
    BriItemSelectionComponent,
    ReportSelectionComponent,
    AppSelectionDialogComponent,
    EmployeeSelectionComponent,
    PrSelectionDialogConsolidateComponent,
    PurchaseRequestAttachmentComponent,
    PrItemDetailsDialogComponent,
    PrListItemDialogComponent,
    ConfirmationDialogComponent,
    RfqListItemsComponent,
    CanvassSelectionItemsDialogComponent,
    PoListItemsComponent,
    PrSelectionDialogPoComponent,
    RisPrSelectionDialogComponent,
    TwItemSelectionDialogComponent,
    ActualPoSelectionDialogComponent,
    PriSelectionDialogComponent,
    WmrItemSelectionDialogComponent,
    PoriSelectionDialogComponent,
    PreRepairItemDetailsDialogComponent,
  ],
  imports: [
    ToastrModule.forRoot({
      maxOpened: 1,
      autoDismiss: true
    }),
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    CurrencyMaskModule,
    FlexLayoutModule,
    SidebarModule
  ],
  providers: [SideBarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
