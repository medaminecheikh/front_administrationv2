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
import {filter} from "rxjs";

@Component({
  selector: 'app-list-profil',
  templateUrl: './list-profil.component.html',
  styleUrls: ['./list-profil.component.scss']
})
export class ListProfilComponent implements OnInit{
  profilForm !: FormGroup;
  profil!: Profil;
  profils: Profil[]=[];
  showError:boolean =false;
  functions:Fonctionalite[]=[];
  models:Model[]=[] ;
  selectedModel !:Model | undefined;
  treeData: TreeNode[] = [];
  selectedFonc :Fonctionalite[]=[];
  selectedItems: TreeNode[] = [];
  model= new FormControl();
  desc:string='';
  keyword:string='';
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
  size: number = 5;
  pages: number[] = [];
  profilUpdate!: Profil | null;

  constructor(private profilService:ProfilService,
              private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}


  ngOnInit(): void {
    this.searchProfils();
    this.getAllModels();
    this.initializeProfilForm();
    this.getAllFonctions();
    this.subscribeToModelChanges();
  }



  selectNodes(nodes: TreeNode[], selectedFonctions: Fonctionalite[]) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        // If the node has children, recursively traverse them
        this.selectNodes(node.children, selectedFonctions);
        // If any child is selected, add that child to the selected items list, but don't select the parent node unless all his children is selected
        const allChildrenSelected = node.children.every(child => child.partialSelected);
        const parentSelected = selectedFonctions.some(fonc => fonc.idFonc === node.data.idFonc);
        if (allChildrenSelected && parentSelected) {
          node.partialSelected = false;
          if (!this.selectedItems.some(item => item.data.idFonc === node.data.idFonc)) {
            this.selectedItems.push(node);
          }
        } else {
          node.children.forEach(child => {
            if (child.partialSelected && !this.selectedItems.some(item => item.data.idFonc === child.data.idFonc)) {
              this.selectedItems.push(child);
            } else if (!child.partialSelected && this.selectedItems.some(item => item.data.idFonc === child.data.idFonc)) {
              const index = this.selectedItems.findIndex(item => item.data.idFonc === child.data.idFonc);
              this.selectedItems.splice(index, 1);
            } else {
              child.partialSelected = false; // Set partialSelected to false for child nodes
            }
          });
        }
      } else {
        // If the node has no children, select/deselect it based on selectedFonctions
        node.partialSelected = selectedFonctions.some(fonc => fonc.idFonc === node.data.idFonc);
        if (node.partialSelected && !this.selectedItems.some(item => item.data.idFonc === node.data.idFonc)) {
          this.selectedItems.push(node);
        } else if (!node.partialSelected && this.selectedItems.some(item => item.data.idFonc === node.data.idFonc)) {
          const index = this.selectedItems.findIndex(item => item.data.idFonc === node.data.idFonc);
          this.selectedItems.splice(index, 1);
        }
      }
    }
  }
  onSelectionModel() {
    const id = this.model.value;
    this.selectedModel = this.models.find(model => model.idModel === id)
    console.log(this.selectedModel)
    if (this.selectedModel) {
      const selectedFonctions: Fonctionalite[] = this.selectedModel.fonctions;
      this.selectedItems = []; // Clear the selected items list
      this.selectNodes(this.treeData, selectedFonctions); // Traverse the tree and select/deselect nodes
      this.onSelectedItemsChange();
      console.log(this.selectedItems)
    }
  }
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
  expandAll() {
    this.treeData.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }
  onSelectedItemsChange() {
    this.selectedFonc = this.selectedItems
      .filter(item => !this.selectedModel?.fonctions.some(fonc => fonc.idFonc === item.data.idFonc))
      .map(item => item.data);
  }

  noWhitespaceStartorEnd(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const trimmedValue = value.trim();
    const isValid = value === trimmedValue;
    return isValid ? null : { whitespace: true };
  }
  Clear() {
    this.selectedModel=undefined;
    this.profilUpdate=null;

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
    this.profilService.searchPageProfils(this.keyword, this.desc,this.page, this.size)
      .subscribe(data => {
        this.profils = data;
        console.log(this.profils)
        this.userPage.content = data;
        if (data.length > 0) {
          this.userPage.totalPages = Math.ceil(data[0].totalElements / this.size);
        }
        this.updatePages();
      });
  }

  resetFilter() {
    this.keyword='';
    this.desc='';
    this.size=5;
  }



  updateProfil() {

  }


  onRowDoubleClick(profil: Profil) {

    this.profilUpdate=profil;
    this.profilForm.patchValue({
      nomP: profil.nomP,
      des_P: profil.des_P,
    });
    this.selectedModel=profil.model;

  }

  private getAllModels(): void {
    this.modelService.getAllModels().subscribe((data: Model[]) => {
      this.models = data;
    });
  }
  private initializeProfilForm(): void {
    this.profilForm = this.formBuilder.group({
      nomP: ['', [Validators.maxLength(30), this.noWhitespaceStartorEnd]],
      des_P: ['', [Validators.maxLength(100), this.noWhitespaceStartorEnd]]
    });
  }
  subscribeToModelChanges() {
    this.model.valueChanges.subscribe(value => {
      if (value === null || value === "null") {
        if (this.selectedModel && this.selectedModel.fonctions) {
          // Remove previously selected functions from selectedFoncs
          for (const fonc of this.selectedModel.fonctions) {
            const index = this.selectedFonc.findIndex(selectedFonc => selectedFonc.idFonc === fonc.idFonc);
            if (index >= 0) {
              this.selectedFonc.splice(index, 1);
            }
          }
          // Remove selected items that have the same idFonc as model.fonctions[].idFonc
          this.selectedItems = this.selectedItems.filter(item => !this.selectedModel?.fonctions.some(fonc => fonc.idFonc === item.data.idFonc));
        }
        // Clear selected model
        this.selectedModel = undefined;
        this.onSelectionModel();
      } else {
        if (this.selectedModel && this.selectedModel.fonctions) {
          // Remove previously selected functions from selectedFoncs
          for (const fonc of this.selectedModel.fonctions) {
            const index = this.selectedFonc.findIndex(selectedFonc => selectedFonc.idFonc === fonc.idFonc);
            if (index >= 0) {
              this.selectedFonc.splice(index, 1);
            }
          }
          // Remove selected items that have the same idFonc as model.fonctions[].idFonc
          this.selectedItems = this.selectedItems.filter(item => !this.selectedModel?.fonctions.some(fonc => fonc.idFonc === item.data.idFonc));
        }
        // Set selected model
        this.selectedModel = this.models.find(model => model.idModel === value);
        this.onSelectionModel();
      }
    });
  }

  private getAllFonctions(): void {
    // Subscribe to the observable returned by the foncService's getAllFoncs method
    this.foncService.getAllFoncs().subscribe((foncs: Fonctionalite[]) => {
      // Filter the foncs to get only the parent nodes
      const parents = foncs.filter((fonc) => !fonc.fon_COD_F && fonc.nomMENU);
      // Filter the foncs to get only the child nodes
      const children = foncs.filter((fonc) => fonc.fon_COD_F && fonc.nomMENU);

      // Map the parent nodes to an array of parent node objects
      const parentNodes = parents.map((parent) => {
        // Filter the child nodes to get only those that belong to the current parent node
        const childrenNodes = children.filter((child) => child.nomMENU === parent.nomMENU && !child.fon_COD_F?.includes("-"));

        // Map the child nodes to an array of child node objects
        return {
          label: parent.nomF, // The label to display for the parent node
          data: parent, // The data to associate with the parent node
          icon: 'pi pi-fw pi-list', // The icon to display for the parent node
          children: childrenNodes.map((child) => {
            // Filter the grandchild nodes to get only those that belong to the current child node
            const grandchildrenNodes = children.filter(grandchild => {
              const childPrefix = `${child.fon_COD_F}-`;
              return grandchild.fon_COD_F && grandchild.fon_COD_F.startsWith(childPrefix) && grandchild.nomMENU === child.nomMENU;
            });

            // Remove any duplicate grandchildren based on their nomF property
            const uniqueGrandchildren = Array.from(new Set(grandchildrenNodes.map(grandchild => grandchild.nomF)))
              .map(nomF => grandchildrenNodes.find(grandchild => grandchild.nomF === nomF));

            // Map the grandchild nodes to an array of grandchild node objects
            return {
              label: child.nomF, // The label to display for the child node
              data: child, // The data to associate with the child node
              icon: 'pi pi-spin pi-cog', // The icon to display for the child node
              children: uniqueGrandchildren.map((grandchild) => ({
                label: grandchild?.nomF, // The label to display for the grandchild node
                data: grandchild, // The data to associate with the grandchild node
                icon: 'pi pi-spin pi-cog', // The icon to display for the grandchild node
              })),
            };
          }),
        };
      });

      // Assign the parent nodes to the treeData property of the component
      this.treeData = parentNodes;
      console.log(this.treeData);

      // Expand all nodes in the tree
      this.expandAll();
    });
  }
}
