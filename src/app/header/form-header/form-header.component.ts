import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.css']
})
export class FormHeaderComponent implements OnInit {
  @Input() formName: string;
  lgu: string = environment.lgu;
  @Input() showLine2: boolean = true;
  @Input() showLine3: boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

}
