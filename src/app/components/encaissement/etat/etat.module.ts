import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EtatRoutingModule} from './etat-routing.module';
import {E3VersementComponent} from './e3-versement/e3-versement.component';
import {E1EncaissementComponent} from './e1-encaissement/e1-encaissement.component';
import {E2ModificationComponent} from "./e2-modification/e2-modification.component";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";


@NgModule({
  declarations: [
    E2ModificationComponent,
    E3VersementComponent,
    E1EncaissementComponent
  ],
    imports: [
        CommonModule,
        EtatRoutingModule,
        SharedModule,
        TableModule,
        TagModule
    ]
})
export class EtatModule { }
