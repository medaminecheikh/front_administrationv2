import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechercheRoutingModule } from './recherche-routing.module';
import { RechercheEncaissementComponent } from './recherche-encaissement/recherche-encaissement.component';
import { RechercheFactureComponent } from './recherche-facture/recherche-facture.component';
import { JournalEncaissementComponent } from './journal-encaissement/journal-encaissement.component';
import {CarouselModule} from "primeng/carousel";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";


@NgModule({
  declarations: [
    RechercheEncaissementComponent,
    RechercheFactureComponent,
    JournalEncaissementComponent
  ],
  imports: [
    CommonModule,
    RechercheRoutingModule,
    CarouselModule,
    ButtonModule,
    TagModule
  ]
})
export class RechercheModule { }
