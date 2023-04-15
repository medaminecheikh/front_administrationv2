import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardadminRoutingModule} from './dashboardadmin-routing.module';
import {DashboardadminComponent} from './dashboardadmin.component';



@NgModule({
  declarations: [
    DashboardadminComponent
  ],
  imports: [
    CommonModule,
    DashboardadminRoutingModule
  ]
})
export class DashboardadminModule { }
