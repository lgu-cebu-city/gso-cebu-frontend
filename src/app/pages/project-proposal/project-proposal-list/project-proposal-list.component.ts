import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/util/notification_type';
import { environment } from 'src/environments/environment';
import { ProjectProposalItemsModel } from '../../../data-model/project-proposal-items-model';
import { ProjectProposalModel } from '../../../data-model/project-proposal-model';
import { ProjectProposalSOFModel } from '../../../data-model/project-proposal-sof-model';
import { ProjectProposalComponent } from '../project-proposal.component';

@Component({
  selector: 'app-project-proposal-list',
  templateUrl: './project-proposal-list.component.html',
  styleUrls: ['./project-proposal-list.component.css']
})
export class ProjectProposalListComponent implements OnInit {
  envFirstLoad = environment.firstLoad;
  displayedColumnsPP: string[] = ['referenceNo','referenceDate','departmentName','projectTitle','projectLocation','projLocBarangay','description','rationale','projectStartDate','projectDuration','projectType','projectCost','action'];
  displayedColumnsPPNoAction: string[] = ['referenceNo','referenceDate','departmentName','projectTitle','projectLocation','projLocBarangay','description','rationale','projectStartDate','projectDuration','projectType','projectCost',];
  displayedColumnsPPSOF: string[] = ['year', 'sofDescription', 'amount'];
  displayedColumnsPPItemDetails: string[] = ['description','quantity', 'uom', 'cost', 'total', 'remarks'];
  ppList: ProjectProposalModel[] = [];
  dataSource: MatTableDataSource<ProjectProposalModel> = new MatTableDataSource<ProjectProposalModel>(this.ppList);
  sofList: ProjectProposalSOFModel[] = [];
  itemDetails: ProjectProposalItemsModel[] = [];
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  datepipe: DatePipe = new DatePipe('en-US');
  selectedPP: ProjectProposalModel;
  module = this;
  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    public commonFunction: CommonFunctionService,
    private notifService : NotificationService,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printButton') printBtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.commonFunction.createFn = this.createFn;
    this.commonFunction.editFn = this.editFn;
    this.commonFunction.deleteFn = this.deleteFn;
    this.commonFunction.printFn = this.printFn;
    this.commonFunction.module = this.module;
    this.commonFunction.printBtn = this.printBtn;
    this.commonFunction.dialog = this.dialog;
  }

  loadData() {
    this.httpRequest.getAllProjectProposal().subscribe((result) => {
      if (result.statusCode == 200) {
        this.ppList = result.data;
        this.dataSource = new MatTableDataSource<ProjectProposalModel>(this.ppList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.ppList.length) {
          this.selectedPP = this.ppList[0];
          this.sofList = this.ppList[0].sof;
          this.itemDetails = this.ppList[0].items;
        } else {
          this.selectedPP = null;
          this.sofList = [];
          this.itemDetails = [];
        }
      }
    });
  }

  textFilter(event: Event) {
    var filterValue: string;
    filterValue = (event.target as HTMLInputElement).value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  dateFilterChanged(event: MatDatepickerInputEvent<Date>) {
    var currTextFilter = this.dataSource.filter;
    var filterDate: string = event.value?.toLocaleDateString() || "";
    
    if (filterDate != "") {
      this.dataSource = new MatTableDataSource<ProjectProposalModel>(this.ppList.filter(
           e => this.datepipe.transform(e.referenceDate.toString(), 'MMM d, yyyy') == this.datepipe.transform(filterDate, 'MMM d, yyyy')));
    } else {
      this.dataSource = new MatTableDataSource<ProjectProposalModel>(this.ppList);
    }
    
    if (currTextFilter != "") {
      this.dataSource.filter = currTextFilter;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  rowSelected(row: ProjectProposalModel) {
    this.selectedPP = row;
    this.sofList = row.sof;
    this.itemDetails = row.items;
  }

  viewData(data: ProjectProposalModel) {
    this.router.navigate(["/project-proposal", { id: data.id }]);
  }

  printData(index: number){
    this.selectedPP = this.ppList[index];
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }

  formatNumber(value: any): string {
    return value.toFixed(2);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }

  createFn() {
    const dialogRef = this.dialog.open(ProjectProposalComponent, {panelClass: 'custom-dialog-container'},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  editFn() {
    const dialogRef = this.dialog.open(ProjectProposalComponent, {panelClass: 'custom-dialog-container', data: {
      selectedData: this.module.selectedPP
    }},);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.module.loadData();
      }
    });
  }

  deleteFn() {
    this.module.httpRequest.deleteProjectProposal(this.module.selectedPP.id).subscribe((result) => {
      if (result.statusCode == 200) {
        this.module.notifService.showNotification(NotificationType.success, "Successfully deleted!");
        this.module.loadData();
      } else {
        this.module.notifService.showNotification(NotificationType.error, "Delete Data Failed!");
      }
    });
  }

  printFn() {
    setTimeout(() => 
    {
      let el: HTMLElement = this.printBtn.nativeElement;
      el.click();
    },
    500);
  }
}
