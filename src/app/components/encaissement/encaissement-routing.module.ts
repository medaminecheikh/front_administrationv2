import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {BoGuard} from "../../guards/bo.guard";
import {FoGuard} from "../../guards/fo.guard";

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
    loadChildren: () => import('./caisse/caisse.module').then(m => m.CaisseModule),canActivate: [FoGuard]
  },
  {
    path: 'etat',
    loadChildren: () => import('./etat/etat.module').then(m => m.EtatModule),canActivate: [BoGuard]
  },
  {
    path: 'ett',
    loadChildren: () => import('./ett/ett.module').then(m => m.EttModule),canActivate: [BoGuard]
  },
  {
    path: 'recherche',
    loadChildren: () => import('./recherche/recherche.module').then(m => m.RechercheModule),canActivate: [FoGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncaissementRoutingModule { }
