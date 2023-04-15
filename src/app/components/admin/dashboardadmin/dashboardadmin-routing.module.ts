import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardadminComponent} from './dashboardadmin.component';

const routes: Routes = [{ path: '', component: DashboardadminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardadminRoutingModule { }
