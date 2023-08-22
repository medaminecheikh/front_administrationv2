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
import {KeyFilterModule} from "primeng/keyfilter";
import {InputNumberModule} from "primeng/inputnumber";
import {RippleModule} from "primeng/ripple";
import { ListFactureComponent } from './list-facture/list-facture.component';
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ProgressBarModule} from "primeng/progressbar";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SpeedDialModule} from "primeng/speeddial";
import {DialogModule} from "primeng/dialog";
import {AnimateModule} from "primeng/animate";
import {SelectButtonModule} from "primeng/selectbutton";
import {BlockUIModule} from "primeng/blockui";
import {TimelineModule} from "primeng/timeline";
import {CardModule} from "primeng/card";


@NgModule({
  declarations: [
    EncaissementFactureComponent,
    PaimentAvanceComponent,
    ListFactureComponent
  ],
  imports: [
    CommonModule,
    CaisseRoutingModule,
    CalendarModule,
    ConfirmDialogModule,
    TabViewModule,
    FieldsetModule,
    InputTextModule,
    KeyFilterModule,
    InputNumberModule,
    RippleModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    DropdownModule,
    FormsModule,
    SpeedDialModule,
    ReactiveFormsModule,
    DialogModule,
    AnimateModule,
    SelectButtonModule,
    BlockUIModule,
    TimelineModule,
    CardModule,

  ]
})
export class CaisseModule { }
