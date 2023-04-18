import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListModelComponent} from "./list-model/list-model.component";
import {AddModelComponent} from "./add-model/add-model.component";
import {UpdateModelComponent} from "./update-model/update-model.component";
import {DetailModelComponent} from "./detail-model/detail-model.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'add', component: AddModelComponent},
      {path: 'update/:id', component: UpdateModelComponent},
      {path: 'detail/:id', component: DetailModelComponent},
      {path: 'list', component: ListModelComponent},
      {path: '', redirectTo: 'list', pathMatch: 'full'},
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelRoutingModule {
}
