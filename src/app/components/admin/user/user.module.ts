import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {AddUserComponent} from "./add-user/add-user.component";
import {ListUserComponent} from "./list-user/list-user.component";
import {DetailUserComponent} from "./detail-user/detail-user.component";
import {UpdateUserComponent} from "./update-user/update-user.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DividerModule} from "primeng/divider";
import {MultiSelectModule} from "primeng/multiselect";
import {DropdownModule} from "primeng/dropdown";
import {PickListModule} from "primeng/picklist";
import {ChipsModule} from "primeng/chips";
import {ChipModule} from "primeng/chip";
import {TagModule} from "primeng/tag";
import {TooltipModule} from "primeng/tooltip";


@NgModule({
  declarations: [

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
        DividerModule,
        MultiSelectModule,
        DropdownModule,
        PickListModule,
        ChipsModule,
        ChipModule,
        TagModule,
        TooltipModule,


    ]
})
export class UserModule { }
