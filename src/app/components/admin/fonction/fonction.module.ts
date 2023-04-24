import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FonctionRoutingModule} from './fonction-routing.module';
import {ListFoncComponent} from "./list-fonc/list-fonc.component";
import {DetailFoncComponent} from "./detail-fonc/detail-fonc.component";
import {AddFoncComponent} from "./add-fonc/add-fonc.component";
import {UpdateFoncComponent} from "./update-fonc/update-fonc.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [

    ListFoncComponent,
    AddFoncComponent,
    UpdateFoncComponent,
    DetailFoncComponent,
  ],
    imports: [
        CommonModule,
        FonctionRoutingModule,
        ReactiveFormsModule,
        MatInputModule,
        FormsModule
    ]
})
export class FonctionModule { }
