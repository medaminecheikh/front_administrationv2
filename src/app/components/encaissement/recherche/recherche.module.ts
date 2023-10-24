import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechercheRoutingModule } from './recherche-routing.module';
import { RechercheEncaissementComponent } from './recherche-encaissement/recherche-encaissement.component';
import { RechercheFactureComponent } from './recherche-facture/recherche-facture.component';
import { JournalEncaissementComponent } from './journal-encaissement/journal-encaissement.component';
import {CarouselModule} from "primeng/carousel";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";
import {PaginatorModule} from "primeng/paginator";
import {SelectButtonModule} from "primeng/selectbutton";
import {ReactiveFormsModule} from "@angular/forms";
import {SliderModule} from "primeng/slider";
import {InputTextModule} from "primeng/inputtext";
import {KeyFilterModule} from "primeng/keyfilter";
import {ProgressBarModule} from "primeng/progressbar";
import {ChipModule} from "primeng/chip";


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
    TagModule,
    PaginatorModule,
    SelectButtonModule,
    ReactiveFormsModule,
    SliderModule,
    InputTextModule,
    KeyFilterModule,
    ProgressBarModule,
    ChipModule
  ]
})
export class RechercheModule { }
