import {Component, OnInit} from '@angular/core';
import {Profil} from "../../../../modules/Profil";
import {Page} from "../../../../modules/Page";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Model} from "../../../../modules/Model";
import {TreeNode} from "primeng/api";
import {ProfilService} from "../../../../services/profil.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";

@Component({
  selector: 'app-list-profil',
  templateUrl: './list-profil.component.html',
  styleUrls: ['./list-profil.component.scss']
})
export class ListProfilComponent implements OnInit{
  profilForm !: FormGroup;
  profil!: Profil;
  showError:boolean =false;
  functions:Fonctionalite[]=[];
  models:Model[]=[] ;
  selectedModel !:Model | undefined;
  treeData: TreeNode[] = [];
  selectedFonc :Fonctionalite[]=[];
  selectedItems: TreeNode[] = [];
  model= new FormControl();

  userPage: Page = {
    totalPages: 0,
    totalElements: 0,
    last: false,
    first: false,
    size: 0,
    number: 0,
    numberOfElements: 0,
    content: []
  };
  page: number = 0;
  size: number = 10;
  pages: number[] = [];
  profilUpdate!: Profil;

  constructor(private profilService:ProfilService,
              private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}


  ngOnInit(): void {

    this.profilForm= this.formBuilder.group({
      nomP: ['',  [Validators.maxLength(30),this.noWhitespaceStartorEnd]],
      des_P: ['', [Validators.maxLength(100),this.noWhitespaceStartorEnd]]
    });
  }

  noWhitespaceStartorEnd(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const trimmedValue = value.trim();
    const isValid = value === trimmedValue;
    return isValid ? null : { whitespace: true };
  }
  Clear() {

  }

  refresh() {

  }



  updatePages() {
    if (this.userPage.totalPages <= 5) {
      this.pages = Array(this.userPage.totalPages).fill(0).map((x, i) => i);
    } else if (this.page < 3) {
      this.pages = [0, 1, 2, 3, -1, this.userPage.totalPages - 1];
    } else if (this.page >= this.userPage.totalPages - 3) {
      this.pages = [0, -1, this.userPage.totalPages - 4, this.userPage.totalPages - 3, this.userPage.totalPages - 2, this.userPage.totalPages - 1];
    } else {
      this.pages = [0, -1, this.page - 1, this.page, this.page + 1, -1, this.userPage.totalPages - 1];
    }

    if (this.page == 0) {
      this.userPage.first = true;
    } else {
      this.userPage.first = false;
    }
    if (this.page == this.userPage.totalPages - 1) {
      this.userPage.last = true;
    } else {
      this.userPage.last = false;
    }
  }

  goToPage(n: number) {
    this.page = n;
    this.searchProfils();
  }

  onNext() {
    this.page++;
    this.searchProfils();
  }

  onPrev() {
    this.page--;
    this.searchProfils();
  }

  searchProfils() {

  }

  resetFilter() {

  }

  updateProfil() {

  }

  onSelectedItemsChange() {

  }
}
