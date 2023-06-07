import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {E1EncaissementComponent} from "./e1-encaissement/e1-encaissement.component";
import {E2ModificationComponent} from "./e2-modification/e2-modification.component";
import {E3VersementComponent} from "./e3-versement/e3-versement.component";
import {BoGuard} from "../../../guards/bo.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'e1', component: E1EncaissementComponent ,canActivate: [BoGuard]},
      { path: 'e2', component: E2ModificationComponent,canActivate: [BoGuard]},
      { path: 'e3', component: E3VersementComponent,canActivate: [BoGuard]},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatRoutingModule { }
