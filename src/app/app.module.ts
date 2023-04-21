import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {LoginComponent} from './components/login/login.component';

import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {AdminModule} from "./components/admin/admin.module";
import {LayoutsModule} from "./layouts/layouts/layouts.module";
import {TokenInterceptorService} from "./services/token-interceptor.service";
import {ScrollTopModule} from "primeng/scrolltop";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
      tapToDismiss: true,
      enableHtml: true,
      toastClass: 'toastr-custom'
    }),
    AdminModule,
    LayoutsModule,
    ScrollTopModule,


  ],
  providers: [ {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true}],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
