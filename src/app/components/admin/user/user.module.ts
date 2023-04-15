import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import {AddUserComponent} from "./add-user/add-user.component";
import {RouterModule, Routes} from "@angular/router";
import {ListUserComponent} from "./list-user/list-user.component";
import {DetailUserComponent} from "./detail-user/detail-user.component";
import {UpdateUserComponent} from "./update-user/update-user.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LayoutsModule} from "../../../layouts/layouts/layouts.module";


@NgModule({
  declarations: [
    UserComponent,
    AddUserComponent,
    DetailUserComponent,
    ListUserComponent,
    UpdateUserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,


  ]
})
export class UserModule { }
