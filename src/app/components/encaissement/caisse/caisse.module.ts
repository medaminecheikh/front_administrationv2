import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CaisseRoutingModule} from './caisse-routing.module';
import { EncaissementFactureComponent } from './encaissement-facture/encaissement-facture.component';
import { PaimentAvanceComponent } from './paiment-avance/paiment-avance.component';
import {CalendarModule} from "primeng/calendar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TabViewModule} from "primeng/tabview";
import {FieldsetModule} from "primeng/fieldset";
import {InputTextModule} from "primeng/inputtext";


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
    TabViewModule,
    FieldsetModule,
    InputTextModule,

  ]
})
export class CaisseModule { }
