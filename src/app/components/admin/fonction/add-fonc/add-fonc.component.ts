import {Component, OnInit} from '@angular/core';
import {catchError, throwError} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";
import CryptoJS from 'crypto-js';
import {SECRET_KEY} from "../../../../guards/constants";

@Component({
  selector: 'app-add-fonc',
  templateUrl: './add-fonc.component.html',
  styleUrls: ['./add-fonc.component.scss']
})
export class AddFoncComponent implements OnInit{
  model = new FormControl;
  foncForm !: FormGroup;
  showError : boolean =false;
  fonction!:Fonctionalite;

  constructor(private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}


  ngOnInit(): void {

    this.foncForm = this.formBuilder.group({
      codF: ['', [Validators.required, Validators.maxLength(30)]],
      desF: ['', [Validators.required, Validators.maxLength(100)]],
      f_ADM: ['', Validators.required],
      f_DROIT_ACCES: ['', Validators.required],
      fon_COD_F: ['', [ Validators.maxLength(30)]],
      nomF: ['', [Validators.required, Validators.maxLength(50)]],
      nomMENU: ['', [Validators.required, Validators.maxLength(30)]],

    });
  }



  addFonc() {
    if (this.foncForm.valid){
      const fonc = this.foncForm.value;
      this.foncService.addFonc(fonc).pipe(
        catchError((error) => {
          this.toastr.error(error.error, 'Error');
          return throwError(error);
        })
      ).subscribe((response) => {
        const foncId = response.idFonc;
        const id = CryptoJS.AES.encrypt(foncId.trim(), SECRET_KEY).toString();
        this.router.navigate(['/fonction/detail', id]);
        this.toastr.success('Function added successfully!', 'Success');
      });
    }
    else {
      this.showError=true;
      this.toastr.warning('Please fill the form correctly.', 'Warning');
    }
  }

}
