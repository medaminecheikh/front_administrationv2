import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin.component';
import {LayoutsModule} from "../../layouts/layouts/layouts.module";


@NgModule({
  declarations: [
    AdminComponent,



  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutsModule,


  ]
})
export class AdminModule { }
