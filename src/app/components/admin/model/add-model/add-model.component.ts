import {Component, OnInit} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Model} from "../../../../modules/Model";
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss']
})
export class AddModelComponent implements OnInit{
  showError:boolean =false;
  modelForm !: FormGroup;
  model!:Model;
  foncs:Fonctionalite[]=[];
  selectedFonc :Fonctionalite[]=[];
  constructor(private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}



  ngOnInit(): void {
    this.foncService.getAllFoncs().subscribe((data:Fonctionalite[])=>{
      this.foncs=data;
    });
    this.modelForm = this.formBuilder.group({
      obs: ['', [Validators.required, Validators.maxLength(30)]],
      desMOD: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }
  addModel() {
  if (this.modelForm.valid)
  {

  }else {
    this.showError=true;
    this.toastr.warning('Please fill the form correctly.', 'Warning');
  }
  }
}
