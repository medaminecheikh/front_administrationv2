import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ModelRoutingModule} from './model-routing.module';
import {ModelComponent} from './model.component';
import {ListModelComponent} from "./list-model/list-model.component";
import {AddModelComponent} from "./add-model/add-model.component";
import {UpdateModelComponent} from "./update-model/update-model.component";
import {DetailModelComponent} from "./detail-model/detail-model.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TreeTableModule} from "primeng/treetable";
import {MultiSelectModule} from "primeng/multiselect";
import {TreeModule} from "primeng/tree";
import {FieldsetModule} from "primeng/fieldset";



@NgModule({
  declarations: [
    ModelComponent,
    ListModelComponent,
    AddModelComponent,
    UpdateModelComponent,
    DetailModelComponent,
  ],
  imports: [
    CommonModule,
    ModelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule,
    MultiSelectModule,
    TreeModule,
    FieldsetModule,

  ]
})
export class ModelModule { }
