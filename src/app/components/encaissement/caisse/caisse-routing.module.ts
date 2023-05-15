import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaimentAvanceComponent} from "./paiment-avance/paiment-avance.component";
import {EncaissementFactureComponent} from "./encaissement-facture/encaissement-facture.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'facture', component: EncaissementFactureComponent },
      { path: 'avance', component: PaimentAvanceComponent },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaisseRoutingModule { }
