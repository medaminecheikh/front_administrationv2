import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncaissementRoutingModule } from './encaissement-routing.module';
import { EncaissementComponent } from './encaissement.component';
import {EncaissementlayoutsModule} from "../../layouts/encaissementlayouts/encaissementlayouts.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    EncaissementComponent,
    DashboardComponent
  ],
    imports: [
        CommonModule,
        EncaissementlayoutsModule,
        EncaissementRoutingModule,
        PaginatorModule,
        ReactiveFormsModule,

    ]
})
export class EncaissementModule { }
