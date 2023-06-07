import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RechercheFactureComponent} from "./recherche-facture/recherche-facture.component";
import {RechercheEncaissementComponent} from "./recherche-encaissement/recherche-encaissement.component";
import {JournalEncaissementComponent} from "./journal-encaissement/journal-encaissement.component";
import {FoGuard} from "../../../guards/fo.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'journal', component: JournalEncaissementComponent,canActivate: [FoGuard], },
      { path: 'encaissement', component: RechercheEncaissementComponent,canActivate: [FoGuard] },
      { path: 'facture', component: RechercheFactureComponent,canActivate: [FoGuard]},
      { path: '', redirectTo: 'encaissement', pathMatch: 'prefix' },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RechercheRoutingModule { }
