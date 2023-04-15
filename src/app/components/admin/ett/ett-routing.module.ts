import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UpdateEttComponent} from "./update-ett/update-ett.component";
import {ListEttComponent} from "./list-ett/list-ett.component";
import {AddEttComponent} from "./add-ett/add-ett.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'add', component: AddEttComponent },
      { path: 'update/:id', component: UpdateEttComponent },
      { path: 'list', component: ListEttComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EttRoutingModule { }
