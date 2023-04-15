import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FonctionRoutingModule} from './fonction-routing.module';
import {ListFoncComponent} from "./list-fonc/list-fonc.component";
import {DetailFoncComponent} from "./detail-fonc/detail-fonc.component";
import {AddFoncComponent} from "./add-fonc/add-fonc.component";
import {UpdateFoncComponent} from "./update-fonc/update-fonc.component";


@NgModule({
  declarations: [

    ListFoncComponent,
    AddFoncComponent,
    UpdateFoncComponent,
    DetailFoncComponent,
  ],
  imports: [
    CommonModule,
    FonctionRoutingModule
  ]
})
export class FonctionModule { }
