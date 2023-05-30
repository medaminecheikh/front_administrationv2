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


@NgModule({
  declarations: [
    CaisseComponent,
    PaiementComponent,
    ValidationComponent
  ],
    imports: [
        CommonModule,
        EttRoutingModule,
        DividerModule,
        ReactiveFormsModule,
        DropdownModule,
        FormsModule,
        TableModule
    ]
})
export class EttModule { }
