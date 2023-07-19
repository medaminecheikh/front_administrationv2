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
import {EncaissementlayoutsModule} from "./layouts/encaissementlayouts/encaissementlayouts.module";
import {EncaissementModule} from "./components/encaissement/encaissement.module";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {JWT_OPTIONS, JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {TokenStorageService} from "./services/auth/token-storage.service";
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogService} from "primeng/dynamicdialog";

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
            timeOut: 7000,
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
        EncaissementlayoutsModule,
        EncaissementModule,
        ButtonModule,
        RippleModule,
        ConfirmDialogModule,

    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    ConfirmationService,DialogService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

