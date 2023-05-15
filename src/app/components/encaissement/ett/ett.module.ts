import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EttRoutingModule } from './ett-routing.module';
import { CaisseComponent } from './caisse/caisse.component';
import { PaiementComponent } from './paiement/paiement.component';
import { ValidationComponent } from './validation/validation.component';


@NgModule({
  declarations: [
    CaisseComponent,
    PaiementComponent,
    ValidationComponent
  ],
  imports: [
    CommonModule,
    EttRoutingModule
  ]
})
export class EttModule { }
