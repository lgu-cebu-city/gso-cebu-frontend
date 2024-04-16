import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-morph-entry',
  templateUrl: './morph-entry.component.html',
  styleUrls: ['./morph-entry.component.css']
})
export class MorphEntryComponent implements OnInit {
  form2 = new FormGroup({
    formModel: new FormControl('Hello World', Validators.minLength(2)),
  });
  onSubmit2(): void {
    console.log(this.form2.value);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
