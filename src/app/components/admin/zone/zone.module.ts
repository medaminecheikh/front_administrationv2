import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ZoneRoutingModule} from './zone-routing.module';
import {AddZoneComponent} from "./add-zone/add-zone.component";
import {UpdateZoneComponent} from "./update-zone/update-zone.component";
import {ListZoneComponent} from "./list-zone/list-zone.component";
import {DetailZoneComponent} from "./detail-zone/detail-zone.component";


@NgModule({
  declarations: [
    AddZoneComponent,
    UpdateZoneComponent,
    ListZoneComponent,
    DetailZoneComponent
  ],
  imports: [
    CommonModule,
    ZoneRoutingModule
  ]
})
export class ZoneModule { }
