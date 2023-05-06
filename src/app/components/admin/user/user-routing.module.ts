import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ListUserComponent} from "./list-user/list-user.component";
import {AddUserComponent} from "./add-user/add-user.component";
import {UpdateUserComponent} from "./update-user/update-user.component";
import {DetailUserComponent} from "./detail-user/detail-user.component";

const routes: Routes = [
  {
  path: '',
  children: [
  { path: 'add', component: AddUserComponent },
  { path: 'update/:id', component: UpdateUserComponent },
  { path: 'detail/:id', component: DetailUserComponent },
  { path: 'dashboard', component: ListUserComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
