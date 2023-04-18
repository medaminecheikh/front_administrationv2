import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelRoutingModule } from './model-routing.module';
import { ModelComponent } from './model.component';
import {ListModelComponent} from "./list-model/list-model.component";
import {AddModelComponent} from "./add-model/add-model.component";
import {UpdateModelComponent} from "./update-model/update-model.component";
import {DetailModelComponent} from "./detail-model/detail-model.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


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
        ReactiveFormsModule
    ]
})
export class ModelModule { }
