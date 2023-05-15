import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConsultationComponent} from "./consultation/consultation.component";
import {GenerationComponent} from "./generation/generation.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'consultation', component: ConsultationComponent },
      { path: 'generation', component: GenerationComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BordereauRoutingModule { }
