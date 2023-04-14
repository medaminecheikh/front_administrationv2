 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
 import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  { path: '',
    component: AdminComponent,
    children: [

      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'ett',
        loadChildren: () => import('./ett/ett.module').then((m) => m.EttModule)
      },
      {
        path: 'model',
        loadChildren: () =>
          import('./model/model.module').then((m) => m.ModelModule)
      }
    ]
  }
  ]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
