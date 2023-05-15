import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RechercheFactureComponent} from "./recherche-facture/recherche-facture.component";
import {RechercheEncaissementComponent} from "./recherche-encaissement/recherche-encaissement.component";
import {JournalEncaissementComponent} from "./journal-encaissement/journal-encaissement.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'journal', component: JournalEncaissementComponent },
      { path: 'encaissement', component: RechercheEncaissementComponent },
      { path: 'facture', component: RechercheFactureComponent},
      { path: '', redirectTo: 'encaissement', pathMatch: 'prefix' },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RechercheRoutingModule { }
