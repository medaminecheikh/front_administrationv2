import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddFoncComponent} from "./add-fonc/add-fonc.component";
import {UpdateFoncComponent} from "./update-fonc/update-fonc.component";
import {ListFoncComponent} from "./list-fonc/list-fonc.component";
import {DetailFoncComponent} from "./detail-fonc/detail-fonc.component";


const routes: Routes = [
  {path: '',
    children: [
      { path: 'add', component: AddFoncComponent },
      { path: 'update/:id', component: UpdateFoncComponent },
      { path: 'detail/:id', component: DetailFoncComponent },
      { path: 'list', component: ListFoncComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FonctionRoutingModule { }
