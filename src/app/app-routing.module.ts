import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {LoginGuard} from "./guards/login.guard";
import {AdminComponent} from "./components/admin/admin.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'admin',component:AdminComponent, loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule), canActivate:[LoginGuard] }
  ,{ path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
