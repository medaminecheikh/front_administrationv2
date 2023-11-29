import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardadminRoutingModule} from './dashboardadmin-routing.module';
import {DashboardadminComponent} from './dashboardadmin.component';
import {NgChartsModule} from "ng2-charts";



@NgModule({
  declarations: [
    DashboardadminComponent
  ],
    imports: [
        CommonModule,
        DashboardadminRoutingModule,
        NgChartsModule
    ]
})
export class DashboardadminModule { }
