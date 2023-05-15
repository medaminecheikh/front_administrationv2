import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BordereauRoutingModule } from './bordereau-routing.module';
import { GenerationComponent } from './generation/generation.component';
import { ConsultationComponent } from './consultation/consultation.component';


@NgModule({
  declarations: [
    GenerationComponent,
    ConsultationComponent
  ],
  imports: [
    CommonModule,
    BordereauRoutingModule
  ]
})
export class BordereauModule { }
