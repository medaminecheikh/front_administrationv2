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
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-add-fonc',
  templateUrl: './add-fonc.component.html',
  styleUrls: ['./add-fonc.component.scss']
})
export class AddFoncComponent implements OnInit {
  menuForm = new FormControl();
  foncForm !: FormGroup;
  showError: boolean = false;
  fonction!: Fonctionalite;
  fonctionmenu: Fonctionalite[] = [];
  selectedmenu!:Fonctionalite;
  selectedOption: String = "true";


  constructor(private router: Router, private formBuilder: FormBuilder,
              private toastr: ToastrService, private modelService: ModelService,
              private foncService: FonctionService) {
  }


  ngOnInit(): void {
    this.foncService.getAllFoncs().subscribe((menus) => {
      // filter out menus with non-empty fon_COD_F
      this.fonctionmenu = menus.filter(menu => !menu.fon_COD_F);
    });

    this.foncForm = this.formBuilder.group({
      codF: ['', [Validators.required, Validators.maxLength(30)]],
      desF: ['', [Validators.required, Validators.maxLength(100)]],
      f_ADM: ['', Validators.required],
      f_DROIT_ACCES: ['', Validators.required],
      fon_COD_F: ['', [Validators.maxLength(30)]],
      nomF: ['', [Validators.required, Validators.maxLength(50)]],
      nomMENU: ['', [Validators.required, Validators.maxLength(30)]],

    });
  }


  addFonc() {
    if (this.foncForm.valid) {


      if (this.selectedOption==="true") {
        const fonc = this.foncForm.value;
        fonc.nomMENU = uuidv4().slice(-5);
        fonc.fon_COD_F='';
        this.foncService.addFonc(fonc).pipe(
          catchError((error) => {
            this.toastr.error(error.error, 'Error');
            return throwError(error);
          })
        ).subscribe((response) => {
          const foncId = response.idFonc;
          const id = CryptoJS.AES.encrypt(foncId.trim(), SECRET_KEY).toString();
          this.router.navigate(['admin/fonction/detail', id]);
          this.toastr.success('Function added successfully!', 'Success');
        });
      }
    } else {
      this.showError = true;
      this.toastr.warning('Please fill the form correctly.', 'Warning');
    }
  }

  onSelectionmenu() {
console.log("!!!!!!!!!!!!",this.menuForm.value)

  }
}
