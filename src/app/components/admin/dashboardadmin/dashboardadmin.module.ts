import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardadminRoutingModule} from './dashboardadmin-routing.module';
import {DashboardadminComponent} from './dashboardadmin.component';
import {NgChartsModule} from "ng2-charts";
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DashboardadminComponent
  ],
  imports: [
    CommonModule,
    DashboardadminRoutingModule,
    NgChartsModule,
    DropdownModule,
    ReactiveFormsModule
  ]
})
export class DashboardadminModule { }
