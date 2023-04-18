import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddProfilComponent} from "./add-profil/add-profil.component";
import {UpdateProfilComponent} from "./update-profil/update-profil.component";
import {ListProfilComponent} from "./list-profil/list-profil.component";
import {DetailProfilComponent} from "./detail-profil/detail-profil.component";


const routes: Routes = [
  {path: '',
    children: [
      { path: 'add', component: AddProfilComponent },
      { path: 'update/:id', component: UpdateProfilComponent },
      { path: 'detail/:id', component: DetailProfilComponent },
      { path: 'list', component: ListProfilComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilRoutingModule { }
