import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ValidationComponent} from "./validation/validation.component";
import {PaiementComponent} from "./paiement/paiement.component";
import {CaisseComponent} from "./caisse/caisse.component";
import {BoGuard} from "../../../guards/bo.guard";

const routes: Routes = [

  {
    path: '',
    children: [
      { path: 'paiement', component: PaiementComponent,canActivate: [BoGuard] },
      { path: 'caisse', component: CaisseComponent,canActivate: [BoGuard] },
      { path: 'validation', component: ValidationComponent,canActivate: [BoGuard]},
      {
        path: 'bordereau',
        loadChildren: () => import('./bordereau/bordereau.module').then(m => m.BordereauModule),canActivate: [BoGuard]
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EttRoutingModule { }
