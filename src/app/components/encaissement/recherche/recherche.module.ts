import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechercheRoutingModule } from './recherche-routing.module';
import { RechercheEncaissementComponent } from './recherche-encaissement/recherche-encaissement.component';
import { RechercheFactureComponent } from './recherche-facture/recherche-facture.component';
import { JournalEncaissementComponent } from './journal-encaissement/journal-encaissement.component';


@NgModule({
  declarations: [
    RechercheEncaissementComponent,
    RechercheFactureComponent,
    JournalEncaissementComponent
  ],
  imports: [
    CommonModule,
    RechercheRoutingModule
  ]
})
export class RechercheModule { }
