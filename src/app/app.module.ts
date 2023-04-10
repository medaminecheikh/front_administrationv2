import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { DetailUserComponent } from './components/user/detail-user/detail-user.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { AddFoncComponent } from './components/fonction/add-fonc/add-fonc.component';
import { UpdateFoncComponent } from './components/fonction/update-fonc/update-fonc.component';
import { ListFoncComponent } from './components/fonction/list-fonc/list-fonc.component';
import { DetailFoncComponent } from './components/fonction/detail-fonc/detail-fonc.component';
import { DetailEttComponent } from './components/ett/detail-ett/detail-ett.component';
import { UpdateEttComponent } from './components/ett/update-ett/update-ett.component';
import { AddEttComponent } from './components/ett/add-ett/add-ett.component';
import { ListEttComponent } from './components/ett/list-ett/list-ett.component';
import { ListZoneComponent } from './components/zone/list-zone/list-zone.component';
import { AddZoneComponent } from './components/zone/add-zone/add-zone.component';
import { UpdateZoneComponent } from './components/zone/update-zone/update-zone.component';
import { DetailZoneComponent } from './components/zone/detail-zone/detail-zone.component';
import { DetailDrComponent } from './components/dr/detail-dr/detail-dr.component';
import { AddDrComponent } from './components/dr/add-dr/add-dr.component';
import { UpdateDrComponent } from './components/dr/update-dr/update-dr.component';
import { ListDrComponent } from './components/dr/list-dr/list-dr.component';
import { ListModelComponent } from './components/model/list-model/list-model.component';
import { AddModelComponent } from './components/model/add-model/add-model.component';
import { UpdateModelComponent } from './components/model/update-model/update-model.component';
import { DetailModelComponent } from './components/model/detail-model/detail-model.component';
import { DetailProfilComponent } from './components/profil/detail-profil/detail-profil.component';
import { AddProfilComponent } from './components/profil/add-profil/add-profil.component';
import { UpdateProfilComponent } from './components/profil/update-profil/update-profil.component';
import { ListProfilComponent } from './components/profil/list-profil/list-profil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    ListUserComponent,
    AddUserComponent,
    DetailUserComponent,
    UpdateUserComponent,
    AddFoncComponent,
    UpdateFoncComponent,
    ListFoncComponent,
    DetailFoncComponent,
    DetailEttComponent,
    UpdateEttComponent,
    AddEttComponent,
    ListEttComponent,
    ListZoneComponent,
    AddZoneComponent,
    UpdateZoneComponent,
    DetailZoneComponent,
    DetailDrComponent,
    AddDrComponent,
    UpdateDrComponent,
    ListDrComponent,
    ListModelComponent,
    AddModelComponent,
    UpdateModelComponent,
    DetailModelComponent,
    DetailProfilComponent,
    AddProfilComponent,
    UpdateProfilComponent,
    ListProfilComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
