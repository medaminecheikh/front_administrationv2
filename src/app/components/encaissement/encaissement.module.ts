import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncaissementRoutingModule } from './encaissement-routing.module';
import { EncaissementComponent } from './encaissement.component';
import {EncaissementlayoutsModule} from "../../layouts/encaissementlayouts/encaissementlayouts.module";
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: [
    EncaissementComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    EncaissementlayoutsModule,
    EncaissementRoutingModule,

  ]
})
export class EncaissementModule { }
