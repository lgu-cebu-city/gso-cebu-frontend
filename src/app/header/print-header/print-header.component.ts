import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-print-header',
  templateUrl: './print-header.component.html',
  styleUrls: ['./print-header.component.css']
})
export class PrintHeaderComponent implements OnInit {
  @Input() formName: string;
  province: string = environment.province;
  lgu: string = environment.lgu;

  constructor() { }

  ngOnInit(): void {
  }

}
