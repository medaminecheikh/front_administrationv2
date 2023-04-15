import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddDrComponent} from "./add-dr/add-dr.component";
import {UpdateDrComponent} from "./update-dr/update-dr.component";
import {ListDrComponent} from "./list-dr/list-dr.component";


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'add', component: AddDrComponent },
      { path: 'update/:id', component: UpdateDrComponent },
      { path: 'list', component: ListDrComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrRoutingModule { }
