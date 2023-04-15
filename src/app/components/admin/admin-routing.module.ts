import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: 'dashboard',
    loadChildren: () => import('./dashboardadmin/dashboardadmin.module').then(m => m.DashboardadminModule)
  },
  {
    path: 'zone',
    loadChildren: () => import('./zone/zone.module').then(m => m.ZoneModule)
  },
  {
    path: 'fonction',
    loadChildren: () => import('./fonction/fonction.module').then(m => m.FonctionModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'ett',
    loadChildren: () => import('./ett/ett.module').then(m => m.EttModule)
  },
  {
    path: 'model',
    loadChildren: () => import('./model/model.module').then(m => m.ModelModule)
  },
  { path: 'profil',
    loadChildren: () => import('./profil/profil.module').then(m => m.ProfilModule) },
  { path: 'dr', loadChildren: () => import('./dr/dr.module').then(m => m.DrModule) }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
