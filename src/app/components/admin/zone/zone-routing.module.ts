import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddZoneComponent} from "./add-zone/add-zone.component";
import {UpdateZoneComponent} from "./update-zone/update-zone.component";
import {ListZoneComponent} from "./list-zone/list-zone.component";


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'add', component: AddZoneComponent },
      { path: 'update/:id', component: UpdateZoneComponent },
      { path: 'list', component: ListZoneComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoneRoutingModule { }
