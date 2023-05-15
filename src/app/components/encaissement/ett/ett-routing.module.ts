import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ValidationComponent} from "./validation/validation.component";
import {PaiementComponent} from "./paiement/paiement.component";
import {CaisseComponent} from "./caisse/caisse.component";

const routes: Routes = [

  {
    path: '',
    children: [
      { path: 'paiement', component: PaiementComponent },
      { path: 'caisse', component: CaisseComponent },
      { path: 'validation', component: ValidationComponent},
      {
        path: 'bordereau',
        loadChildren: () => import('./bordereau/bordereau.module').then(m => m.BordereauModule)
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EttRoutingModule { }
