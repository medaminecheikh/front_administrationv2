import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EttRoutingModule} from './ett-routing.module';
import {UpdateEttComponent} from "./update-ett/update-ett.component";
import {AddEttComponent} from "./add-ett/add-ett.component";
import {DetailEttComponent} from "./detail-ett/detail-ett.component";
import {ListEttComponent} from "./list-ett/list-ett.component";


@NgModule({
  declarations: [
    AddEttComponent,
    DetailEttComponent,
    ListEttComponent,
    UpdateEttComponent,
  ],
  imports: [
    CommonModule,
    EttRoutingModule
  ]
})
export class EttModule { }
