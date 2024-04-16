import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProjectProposalItemsModel } from 'src/app/data-model/project-proposal-items-model';
import { ProjectProposalModel } from 'src/app/data-model/project-proposal-model';
import { ProjectProposalSOFModel } from 'src/app/data-model/project-proposal-sof-model';
import { HttpRequestService } from 'src/app/services/http-request.service';

@Component({
  selector: 'app-pp-selection-dialog',
  templateUrl: './pp-selection-dialog.component.html',
  styleUrls: ['./pp-selection-dialog.component.css']
})
export class PpSelectionDialogComponent implements OnInit {
  displayedColumnsPP: string[] = ['referenceNo','referenceDate','departmentName','projectTitle','projectLocation','projLocBarangay','description','rationale','projectStartDate','projectDuration','projectType','projectCost'];
  displayedColumnsPPSOF: string[] = ['year', 'sofDescription', 'amount'];
  displayedColumnsPPItemDetails: string[] = ['quantity', 'uom', 'cost', 'total', 'remarks'];
  ppList: ProjectProposalModel[] = [];
  dataSource: MatTableDataSource<ProjectProposalModel> = new MatTableDataSource<ProjectProposalModel>(this.ppList);
  sofList: ProjectProposalSOFModel[];
  itemDetails: ProjectProposalItemsModel[];
  datepipe: DatePipe = new DatePipe('en-US');
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  selectedPP: ProjectProposalModel;
  constructor(
    private httpRequest: HttpRequestService,
    public router: Router,
    private dialogRef: MatDialogRef<PpSelectionDialogComponent>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
  }
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  formatNumber(value: any): string {
    return value.toFixed(2);
  }

  formatDate(value: any): string {
    return this.datepipe.transform(value, 'MMM d, yyyy') || "";
  }
  
  selectPP() {
    this.dialogRef.close(
      {
        projectProposal: this.selectedPP
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
