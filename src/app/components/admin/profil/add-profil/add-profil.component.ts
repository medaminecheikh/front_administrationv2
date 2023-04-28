import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Profil} from "../../../../modules/Profil";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Model} from "../../../../modules/Model";
import {ProfilService} from "../../../../services/profil.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";
import {catchError, from, mergeMap, of, switchMap, tap, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {SECRET_KEY} from "../../../../guards/constants";
import {TreeNode} from "primeng/api";
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-add-profil',
  templateUrl: './add-profil.component.html',
  styleUrls: ['./add-profil.component.scss']
})
export class AddProfilComponent implements OnInit{
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

  constructor(private profilService:ProfilService,
              private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}


  ngOnInit(): void {

    this.modelService.getAllModels().subscribe((data :Model[]) => {
      this.models = data;

    });

    this.profilForm= this.formBuilder.group({
      nomP: ['', [Validators.required, Validators.maxLength(30)]],
      des_P: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.foncService.getAllFoncs().subscribe((foncs: Fonctionalite[]) => {
      const parents = foncs.filter((fonc) => !fonc.fon_COD_F && fonc.nomMENU);
      const children = foncs.filter((fonc) => fonc.fon_COD_F && fonc.nomMENU);
      const parentNodes = parents.map((parent) => {
        const childrenNodes = children.filter(
          (child) => child.nomMENU === parent.nomMENU
        );
        return {
          label: parent.nomF,
          data: parent,
          icon:'pi pi-fw pi-list',
          children: childrenNodes.map((child) => ({
            label: child.nomF,
            data: child,
            icon:'pi pi-spin pi-cog',
          })),
        };
      });

      this.treeData = parentNodes;
     this.expandAll();
    });
    this.model.valueChanges.subscribe(() => {
      this.onSelectionModel();
    });
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

  selectNodes(nodes: TreeNode[], selectedFonctions: Fonctionalite[]) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        // If the node has children, recursively traverse them
        this.selectNodes(node.children, selectedFonctions);
        // If all children are selected, select the parent node
        node.partialSelected = node.children.some(child => child.partialSelected) || selectedFonctions.some(fonc => fonc.idFonc === node.data.idFonc);
        if (node.partialSelected) {
          this.selectedItems.push(node);
        }
      } else {
        // If the node has no children, select/deselect it based on selectedFonctions
        node.partialSelected = selectedFonctions.some(fonc => fonc.idFonc === node.data.idFonc);
        if (node.partialSelected) {
          this.selectedItems.push(node);
        }
      }
    }
  }

    onSelectedItemsChange() {
    this.selectedFonc = this.selectedItems.map(value => value.data);

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


  addProfil() {
    if (this.profilForm.valid) {
      const profil = this.profilForm.value;
      const selectedFonc: Fonctionalite[] = this.selectedFonc;
      const selectedModel: Model | undefined = this.selectedModel;
      let profilId: String;
      this.profilService.addProfile(profil).pipe(
        tap((response) => {
          // Extract the idUser from the response and store it in profilId variable
          profilId = response.idProfil;

        }),
        switchMap(() => {
          if (selectedFonc.length === 0) {
            // Return an empty observable if selectedFonc is empty
            return of(null);
          } else {
            // Emit each Fonc object in selectedFonc as a separate value
            return from(selectedFonc).pipe(
              mergeMap((fonc) => {
                return this.profilService.affecterFonctionaliteToProfile(fonc.idFonc, profilId).pipe(
                  catchError((error) => {
                    this.toastr.error(error.error, 'Error');
                    return throwError(error);
                  })
                );
              })
            );
          }
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 403) {
              this.toastr.error('Nom Profil already exists !', 'Error');
              return throwError('Nom Profil already exists error !');
            }
          }
          this.toastr.error(error.error, 'Error');
          return throwError(error);
        })
      ).subscribe(() => {
          if (selectedModel) {
            this.profilService.affecterModelToProfile(selectedModel.idModel, profilId).subscribe(
              () => {
                const id = CryptoJS.AES.encrypt(profilId.trim(), SECRET_KEY).toString();
                this.router.navigate(['admin/profil/detail', id])
                this.toastr.success('Profil added successfully!', 'Success');
              },
              (error) => {
                this.toastr.error(error.error, 'Error');
              }
            );
          } else {
            const id = CryptoJS.AES.encrypt(profilId.trim(), SECRET_KEY).toString();
            this.router.navigate(['admin/profil/detail', id])
            this.toastr.success('User added successfully!', 'Success');
          }
          // Handle success
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 404) {
              this.toastr.error('The resource could not be found.', 'Error');
            } else if (error.status === 401) {
              this.toastr.error('Login already exist error.', 'Error');
            } else if (error.status === 403) {
              this.toastr.error('403 error.', 'Error');
            }
          }
        }
      );
    } else {
      this.showError=true;
      this.toastr.warning('Please fill form correctly.', 'Warning');
    }
  }



}
