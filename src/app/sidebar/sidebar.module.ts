import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../angular-material.module';
import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [RouterModule, CommonModule, MaterialModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent]
})

export class SidebarModule { }
