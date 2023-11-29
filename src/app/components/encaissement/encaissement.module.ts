import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EncaissementRoutingModule} from './encaissement-routing.module';
import {EncaissementComponent} from './encaissement.component';
import {EncaissementlayoutsModule} from "../../layouts/encaissementlayouts/encaissementlayouts.module";
import {DashboardComponent} from './dashboard/dashboard.component';
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {NgChartsModule} from "ng2-charts";


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
        ReactiveFormsModule,NgChartsModule

    ]
})
export class EncaissementModule { }
