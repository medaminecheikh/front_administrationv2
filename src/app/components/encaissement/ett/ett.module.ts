import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EttRoutingModule } from './ett-routing.module';
import { CaisseComponent } from './caisse/caisse.component';
import { PaiementComponent } from './paiement/paiement.component';
import { ValidationComponent } from './validation/validation.component';
import {DividerModule} from "primeng/divider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import { UpdateCaisseComponent } from './caisse/update-caisse/update-caisse.component';
import { AffectCaisseComponent } from './caisse/affect-caisse/affect-caisse.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";


@NgModule({
  declarations: [
    CaisseComponent,
    PaiementComponent,
    ValidationComponent,
    UpdateCaisseComponent,
    AffectCaisseComponent
  ],
    imports: [
        CommonModule,
        EttRoutingModule,
        DividerModule,
        ReactiveFormsModule,
        DropdownModule,
        FormsModule,
        TableModule,
        TagModule,
        ConfirmDialogModule
    ]
})
export class EttModule { }
