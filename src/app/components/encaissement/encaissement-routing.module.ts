import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'caisse',
    loadChildren: () => import('./caisse/caisse.module').then(m => m.CaisseModule)
  },
  {
    path: 'etat',
    loadChildren: () => import('./etat/etat.module').then(m => m.EtatModule)
  },
  {
    path: 'ett',
    loadChildren: () => import('./ett/ett.module').then(m => m.EttModule)
  },
  {
    path: 'recherche',
    loadChildren: () => import('./recherche/recherche.module').then(m => m.RechercheModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncaissementRoutingModule { }
