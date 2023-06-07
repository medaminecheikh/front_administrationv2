import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaimentAvanceComponent} from "./paiment-avance/paiment-avance.component";
import {EncaissementFactureComponent} from "./encaissement-facture/encaissement-facture.component";
import {FoGuard} from "../../../guards/fo.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'facture', component: EncaissementFactureComponent ,canActivate: [FoGuard]},
      { path: 'avance', component: PaimentAvanceComponent ,canActivate: [FoGuard]},

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaisseRoutingModule { }
