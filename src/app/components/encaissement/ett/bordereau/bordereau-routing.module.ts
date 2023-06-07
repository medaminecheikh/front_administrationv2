import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConsultationComponent} from "./consultation/consultation.component";
import {GenerationComponent} from "./generation/generation.component";
import {BoGuard} from "../../../../guards/bo.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'consultation', component: ConsultationComponent , canActivate: [BoGuard]},
      { path: 'generation', component: GenerationComponent,canActivate: [BoGuard]},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BordereauRoutingModule { }
