import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilRoutingModule } from './profil-routing.module';
import {AddProfilComponent} from "./add-profil/add-profil.component";
import {ListProfilComponent} from "./list-profil/list-profil.component";
import {UpdateProfilComponent} from "./update-profil/update-profil.component";
import {DetailProfilComponent} from "./detail-profil/detail-profil.component";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {TreeModule} from "primeng/tree";


@NgModule({
  declarations: [
    AddProfilComponent,
    ListProfilComponent,
    UpdateProfilComponent,
    DetailProfilComponent
  ],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    PaginatorModule,
    ReactiveFormsModule,
    TreeModule
  ]
})
export class ProfilModule { }
