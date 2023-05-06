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
import {v4 as uuidv4} from 'uuid';

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
  sousmenu: Fonctionalite [] = [];
  selectedOption: String = "true";
  availableOptions: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  childrenmenuForm:any;
  sousmenuForm=new FormControl();
  constructor(private router: Router, private formBuilder: FormBuilder,
              private toastr: ToastrService, private modelService: ModelService,
              private foncService: FonctionService) {
  }


  ngOnInit(): void {
    this.foncService.getAllFoncs().subscribe((menus) => {
      // filter out menus with non-empty fon_COD_F
      this.fonctionmenu = menus.filter(menu => !menu.fon_COD_F);
      this.childrenmenuForm=menus.filter(menu =>menu.fon_COD_F);
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


    if (this.selectedOption === "true") {

      const nomMenu = uuidv4().slice(-5);
      this.foncForm.patchValue({nomMENU: nomMenu, fon_COD_F: ''});
      if (this.foncForm.valid) {
        const fonc = this.foncForm.value;
        this.foncService.addFonc(fonc).pipe(
          catchError((error) => {
            this.toastr.error(error.error, 'Error');
            return throwError(error);
          })
        ).subscribe(() => {
          this.router.navigate(['admin/fonction/add']).then(() => {
            // Reload the current page
            location.reload();});
          this.toastr.success('Function added successfully!', 'Success');
        });
      } else {
        this.showError = true;
        this.toastr.warning('Please fill the form correctly.', 'Warning');
      }
    }
    else if (this.selectedOption === "false") {
      this.foncForm.patchValue({nomMENU: this.menuForm.value});
      this.setFon_COD_F();
      if (this.foncForm.valid && this.foncForm.get('fon_COD_F')?.value !== null ) {
        const sousfonc = this.foncForm.value;
        this.foncService.addsousFonc(sousfonc).pipe(
          catchError((error) => {
            this.toastr.error(error.error, 'Error');
            return throwError(error);
          })
        ).subscribe(() => {

          this.router.navigate(['admin/fonction/add']).then(() => {
            // Reload the current page
            location.reload();});
          this.toastr.success('Function added successfully!', 'Success');
        });
      } else {
        this.showError = true;
        this.toastr.warning('Please fill the form correctly.', 'Warning');
      }
    }else if (this.selectedOption === "abc") {
      const randomNum = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
      const newFonCODF = this.sousmenuForm + randomNum.toString(); // Append the random number to the value of sousmenuForm

      this.foncForm.patchValue({nomMENU: this.menuForm.value ,fon_COD_F:newFonCODF});
      if (this.foncForm.valid && this.foncForm.get('fon_COD_F')?.value !== null ) {
        const sousfonc = this.foncForm.value;
        this.foncService.addsousFonc(sousfonc).pipe(
          catchError((error) => {
            this.toastr.error(error.error, 'Error');
            return throwError(error);
          })
        ).subscribe(() => {

          this.router.navigate(['admin/fonction/add']).then(() => {
            // Reload the current page
            location.reload();});
          this.toastr.success('Function added successfully!', 'Success');
        });
      } else {
        this.showError = true;
        this.toastr.warning('Please fill the form correctly.', 'Warning');
      }

    }

    else {
      this.showError = true;
      this.toastr.warning('Please fill the form correctly.', 'Warning');
    }
  }

  onSelectionmenu() {
    console.log("!!!!!!!!!!!!", this.menuForm.value)
    const menu = this.menuForm.value;
    this.foncService.getFonctionsByNomMenu(menu).subscribe(value => {
        this.sousmenu = value;
        console.log("SOUS MENU OPTIONS !!!!!", this.sousmenu);

      }
    );

  }

  filteredOptions() {
    const filtered = this.availableOptions.filter(option => {
      return !this.sousmenu.some(item => item.fon_COD_F === option);
    });
    return filtered.length > 0 ? filtered[0] : null;
  }

  setFon_COD_F() {
    const value = this.filteredOptions();
    if (value !== null) {
      this.foncForm.patchValue({ fon_COD_F: value });
    } else {
      this.foncForm.patchValue({fon_COD_F: null});
      this.toastr.warning('No Slots available, Please chose other Fonction .', 'Warning');

    }
  }

}
