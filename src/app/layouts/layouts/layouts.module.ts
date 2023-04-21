import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsRoutingModule } from './layouts-routing.module';
import {FooterComponent} from "../footer/footer.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {TieredMenuModule} from "primeng/tieredmenu";
import {ButtonModule} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {MenubarModule} from "primeng/menubar";


@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    LayoutsRoutingModule,
    TieredMenuModule,
    ButtonModule,
    MenuModule,
    MenubarModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class LayoutsModule { }
