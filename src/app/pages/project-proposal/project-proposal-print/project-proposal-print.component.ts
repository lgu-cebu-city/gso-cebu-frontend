import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectProposalItemsModel } from 'src/app/data-model/project-proposal-items-model';
import { ProjectProposalModel } from 'src/app/data-model/project-proposal-model';

@Component({
  selector: 'app-project-proposal-print',
  templateUrl: './project-proposal-print.component.html',
  styleUrls: ['./project-proposal-print.component.css']
})
export class ProjectProposalPrintComponent implements OnInit {
  displayedColumns: string[] = ['quantity', 'uom', 'description', 'cost', 'total'];
  @Input() ppData: ProjectProposalModel;
  numberFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  constructor() { }

  ngOnInit(): void {
  }

}
