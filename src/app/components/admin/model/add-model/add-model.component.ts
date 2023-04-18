import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Model} from "../../../../modules/Model";


@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss']
})
export class AddModelComponent implements OnInit{
  showError:boolean =false;
  modelForm !: FormGroup;
  model!:Model;
  functions:Fonctionalite[]=[];
  selectedFonc :Fonctionalite[]=[];
  mainMenus: any[] = [];
  fonctions : Fonctionalite[] = [
    {
      codF: '1',
      desF: 'Main menu item 1',
      f_ADM: 1,
      f_DROIT_ACCES: 1,
      fon_COD_F: "",
      idFonc: '1',
      models: [],
      nomF: 'Main menu item 1',
      nomMENU: 'Main Menu',
      profils: [],
      totalElements: 0,
    },
    {
      codF: '2',
      desF: 'Submenu item 1 of Main menu item 2',
      f_ADM: 1,
      f_DROIT_ACCES: 1,
      fon_COD_F: 'Main menu item 2',
      idFonc: '2',
      models: [],
      nomF: 'Submenu item 1 of Main menu item 2',
      nomMENU: 'Main Menu',
      profils: [],
      totalElements: 0,
    },
    {
      codF: '3',
      desF: 'Submenu item 2 of Main menu item 2',
      f_ADM: 1,
      f_DROIT_ACCES: 1,
      fon_COD_F: 'Main menu item 2',
      idFonc: '3',
      models: [],
      nomF: 'Submenu item 2 of Main menu item 2',
      nomMENU: 'Main Menu',
      profils: [],
      totalElements: 0,
    },
    {
      codF: '4',
      desF: 'Main menu item 2',
      f_ADM: 1,
      f_DROIT_ACCES: 1,
      fon_COD_F: "",
      idFonc: '4',
      models: [],
      nomF: 'Main menu item 2',
      nomMENU: 'Main Menu',
      profils: [],
      totalElements: 0,
    },
    {
      codF: '5',
      desF: 'Submenu item 1 of Main menu item 3',
      f_ADM: 1,
      f_DROIT_ACCES: 1,
      fon_COD_F: 'Main menu item 3',
      idFonc: '5',
      models: [],
      nomF: 'Submenu item 1 of Main menu item 3',
      nomMENU: 'Main Menu',
      profils: [],
      totalElements: 0,
    },
    {
      codF: '6',
      desF: 'Submenu item 2 of Main menu item 3',
      f_ADM: 1,
      f_DROIT_ACCES: 1,
      fon_COD_F: 'Main menu item 3',
      idFonc: '6',
      models: [],
      nomF: 'Submenu item 2 of Main menu item 3',
      nomMENU: 'Main Menu',
      profils: [],
      totalElements: 0,
    },
    {
      codF: '7',
      desF: 'Main menu item 3',
      f_ADM: 1,
      f_DROIT_ACCES: 1,
      fon_COD_F: "",
      idFonc: '7',
      models: [],
      nomF: 'Main menu item 3',
      nomMENU: 'Main Menu',
      profils: [],
      totalElements: 0,
    },
  ];

  constructor(private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}



  ngOnInit(): void {

      this.storeMenus();
      console.log('Final main menus:', this.mainMenus);
      console.log('Functions:', this.functions);



    this.modelForm = this.formBuilder.group({
      obs: ['', [Validators.required, Validators.maxLength(30)]],
      desMOD: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }
  toggleSubMenu(mainMenu: any) {
    for (let subMenu of mainMenu.subMenus) {
      subMenu.checked = mainMenu.checked;
      if (subMenu.checked) {
        const index = this.selectedFonc.findIndex((f: Fonctionalite) => f.idFonc === subMenu.idFonc);
        if (index === -1) {
          this.selectedFonc.push(subMenu);
        }
      } else {
        const index = this.selectedFonc.findIndex((f: Fonctionalite) => f.idFonc === subMenu.idFonc);
        if (index !== -1) {
          this.selectedFonc.splice(index, 1);
        }
      }
    }

    // Remove submenu items that belong to unchecked main menu item
    if (!mainMenu.checked) {
      this.selectedFonc = this.selectedFonc.filter((f: Fonctionalite) => {
        return !mainMenu.subMenus.some((sm: any) => sm.idFonc === f.idFonc);
      });
    }

    console.log(this.selectedFonc);
  }
  storeMenus() {
    this.mainMenus = [];
    this.fonctions.forEach((func: Fonctionalite) => {
      if (!func.fon_COD_F) {
        const mainMenu = {
          name: func.nomF,
          subMenus: [] as Fonctionalite[]
        };
        this.fonctions.forEach((subFunc: Fonctionalite) => {
          if (subFunc.fon_COD_F && subFunc.fon_COD_F === func.nomF) {
            mainMenu.subMenus.push(subFunc);
          }
        });
        this.mainMenus.push(mainMenu);
      }
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
