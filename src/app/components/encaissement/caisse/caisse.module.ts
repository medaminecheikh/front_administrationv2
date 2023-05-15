import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CaisseRoutingModule} from './caisse-routing.module';
import { EncaissementFactureComponent } from './encaissement-facture/encaissement-facture.component';
import { PaimentAvanceComponent } from './paiment-avance/paiment-avance.component';


@NgModule({
  declarations: [
    EncaissementFactureComponent,
    PaimentAvanceComponent
  ],
  imports: [
    CommonModule,
    CaisseRoutingModule,

  ]
})
export class CaisseModule { }
