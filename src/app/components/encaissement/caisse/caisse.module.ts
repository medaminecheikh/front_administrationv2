import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CaisseRoutingModule} from './caisse-routing.module';
import { EncaissementFactureComponent } from './encaissement-facture/encaissement-facture.component';
import { PaimentAvanceComponent } from './paiment-avance/paiment-avance.component';
import {CalendarModule} from "primeng/calendar";
import {ConfirmDialogModule} from "primeng/confirmdialog";


@NgModule({
  declarations: [
    EncaissementFactureComponent,
    PaimentAvanceComponent
  ],
  imports: [
    CommonModule,
    CaisseRoutingModule,
    CalendarModule,
    ConfirmDialogModule,

  ]
})
export class CaisseModule { }
