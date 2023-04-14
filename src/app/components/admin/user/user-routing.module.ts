import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ListUserComponent} from "./list-user/list-user.component";
import {AddUserComponent} from "./add-user/add-user.component";
import {DetailUserComponent} from "./detail-user/detail-user.component";
import {UpdateUserComponent} from "./update-user/update-user.component";

const routes: Routes = [
  {
  path: '',
  children: [
  { path: 'add', component: AddUserComponent },
  { path: 'update/:id', component: UpdateUserComponent },
  { path: 'list', component: ListUserComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
