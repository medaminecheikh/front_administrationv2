import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrRoutingModule } from './dr-routing.module';
import {ListDrComponent} from "./list-dr/list-dr.component";
import {AddDrComponent} from "./add-dr/add-dr.component";
import {DetailDrComponent} from "./detail-dr/detail-dr.component";
import {UpdateDrComponent} from "./update-dr/update-dr.component";



@NgModule({
  declarations: [
    ListDrComponent,
    AddDrComponent,
    DetailDrComponent,
    UpdateDrComponent
  ],
  imports: [
    CommonModule,
    DrRoutingModule
  ]
})
export class DrModule { }
