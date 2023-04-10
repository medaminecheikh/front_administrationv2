import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListUserComponent} from "./components/user/list-user/list-user.component";
import {AddUserComponent} from "./components/user/add-user/add-user.component";
import {DetailUserComponent} from "./components/user/detail-user/detail-user.component";
import {UpdateUserComponent} from "./components/user/update-user/update-user.component";
import {LoginComponent} from "./components/login/login.component";
import {ListZoneComponent} from "./components/zone/list-zone/list-zone.component";
import {AddZoneComponent} from "./components/zone/add-zone/add-zone.component";
import {DetailZoneComponent} from "./components/zone/detail-zone/detail-zone.component";
import {UpdateZoneComponent} from "./components/zone/update-zone/update-zone.component";
import {AddEttComponent} from "./components/ett/add-ett/add-ett.component";
import {ListEttComponent} from "./components/ett/list-ett/list-ett.component";
import {UpdateEttComponent} from "./components/ett/update-ett/update-ett.component";
import {DetailEttComponent} from "./components/ett/detail-ett/detail-ett.component";
import {DetailFoncComponent} from "./components/fonction/detail-fonc/detail-fonc.component";
import {AddFoncComponent} from "./components/fonction/add-fonc/add-fonc.component";
import {UpdateFoncComponent} from "./components/fonction/update-fonc/update-fonc.component";
import {ListFoncComponent} from "./components/fonction/list-fonc/list-fonc.component";
import {ListDrComponent} from "./components/dr/list-dr/list-dr.component";
import {AddDrComponent} from "./components/dr/add-dr/add-dr.component";
import {DetailDrComponent} from "./components/dr/detail-dr/detail-dr.component";
import {UpdateDrComponent} from "./components/dr/update-dr/update-dr.component";
import {LoginGuard} from "./guards/login.guard";
import {ListProfilComponent} from "./components/profil/list-profil/list-profil.component";
import {AddProfilComponent} from "./components/profil/add-profil/add-profil.component";
import {UpdateProfilComponent} from "./components/profil/update-profil/update-profil.component";
import {DetailProfilComponent} from "./components/profil/detail-profil/detail-profil.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  { path: 'list-user',   component: ListUserComponent },
  { path: 'add-user',   component: AddUserComponent  },
  { path: 'detail-user/:id',   component: DetailUserComponent },
  { path: 'update-user/:id',   component: UpdateUserComponent },
  { path: 'list-profil',   component: ListProfilComponent },
  { path: 'add-profil',   component: AddProfilComponent },
  { path: 'update-profil/:id',   component: UpdateProfilComponent },
  { path: 'detail-profil/:id',   component: DetailProfilComponent },
  { path: 'login',   component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard',   component: DashboardComponent,canActivate:[LoginGuard] },
  { path: 'list-zone',   component: ListZoneComponent,canActivate:[LoginGuard] },
  { path: 'add-zone',   component: AddZoneComponent,canActivate:[LoginGuard] },
  { path: 'detail-zone/:id',   component: DetailZoneComponent,canActivate:[LoginGuard] },
  { path: 'update-zone/:id',   component: UpdateZoneComponent,canActivate:[LoginGuard] },
  { path: 'update-dr/:id',   component: UpdateDrComponent,canActivate:[LoginGuard] },
  { path: 'detail-dr/:id',   component: DetailDrComponent,canActivate:[LoginGuard] },
  { path: 'list-dr',   component: ListDrComponent,canActivate:[LoginGuard] },
  { path: 'add-dr',   component: AddDrComponent,canActivate:[LoginGuard] },
  { path: 'add-ett',   component: AddEttComponent,canActivate:[LoginGuard] },
  { path: 'list-ett',   component: ListEttComponent,canActivate:[LoginGuard] },
  { path: 'update-ett/:id',   component: UpdateEttComponent,canActivate:[LoginGuard] },
  { path: 'detail-ett/:id',   component: DetailEttComponent,canActivate:[LoginGuard] },
  { path: 'detail-ett/:id',   component: DetailEttComponent,canActivate:[LoginGuard] },
  { path: 'detail-fonc/:id',   component: DetailFoncComponent,canActivate:[LoginGuard] },
  { path: 'update-fonc/:id',   component: UpdateFoncComponent,canActivate:[LoginGuard] },
  { path: 'add-fonc',   component: AddFoncComponent,canActivate:[LoginGuard] },
  { path: 'list-fonction',   component: ListFoncComponent,canActivate:[LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
