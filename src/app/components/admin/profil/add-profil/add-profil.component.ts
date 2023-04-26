import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

interface CustomTreeNode extends TreeNode {
  disabled?: boolean;
}

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
  selectedFiles!: TreeNode[];
  files : TreeNode[] = [];
  selectedFonc :Fonctionalite[]=[];
  models:Model[]=[];
  selectedModel !:Model | null;

  constructor(private profilService:ProfilService,
              private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}


  ngOnInit(): void {

    this.modelService.getAllModels().subscribe((data :Model[]) => {
      this.models = data;

    });
    this.foncService.getAllFoncs().subscribe((data:Fonctionalite[])=>{
      this.files = this.transformToTreeNode(data);
      this.expandAll();
    });

    this.profilForm= this.formBuilder.group({
      nomP: ['', [Validators.required, Validators.maxLength(30)]],
      des_P: ['', [Validators.required, Validators.maxLength(100)]]
    });


  }


  onRowClick(model: Model) {
    if (this.selectedModel === model) {
      this.selectedModel = null;
    } else {
      this.selectedModel = model;
      this.removeFiles(model.fonctions.map(f => f.idFonc));
      this.removeSelectedFonctions(model.fonctions.map(f => f.idFonc));
    }
    this.updateFiles();

  }

  removeFiles(fileIds: string[]) {
    this.files = this.files.filter(node => !fileIds.includes(node.data.idFonc));
    this.selectedFiles = this.selectedFiles.filter(node => !fileIds.includes(node.data.idFonc));
  }

  removeSelectedFonctions(fonctionIds: string[]) {
    this.selectedFonc = this.selectedFonc.filter(f => !fonctionIds.includes(f.idFonc));
  }
  onFileSelectionChange(event: any) {
    this.selectedFonc =this.selectedFiles.map(node => node.data);
  }
  updateFiles() {
    this.foncService.getAllFoncs().subscribe((data: Fonctionalite[]) => {
      if (this.selectedModel) {
        data = data.filter(f => !this.selectedModel?.fonctions.some(mf => mf.idFonc === f.idFonc));
      }
      this.files = this.transformToTreeNode(data);
      this.expandAll();
    });
  }

  uncheckAll() {
    this.selectedModel = null;

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
    this.files.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }
  transformToTreeNode(data: Fonctionalite[]): TreeNode[] {
    const roots: TreeNode[] = [];

    // Create a map of nodes indexed by their IDs
    const nodeMap = new Map<string, TreeNode>();

    // Create tree nodes from data and add them to the map and the appropriate list
    for (const item of data) {

      const isParent = !item.fon_COD_F;
      const icon = isParent ? 'pi pi-fw pi-list' : 'pi pi-fw pi-cog';
      const treeNode = {
        key: item.fon_COD_F || item.nomMENU,
        label: item.nomF,
        data: item,
        icon: icon,
        children: [],
      };
      nodeMap.set(treeNode.key, treeNode);

      if (isParent) {

        roots.push(treeNode);
      } else {
        const parentNode = nodeMap.get(item.nomMENU);
        if (parentNode) {

          parentNode.children?.push(treeNode);
        }
      }
    }

    return roots;
  }


  addProfil() {
    if (this.profilForm.valid) {
      const profil = this.profilForm.value;
      const selectedFonc: Fonctionalite[] = this.selectedFonc;
      const selectedModel: Model | null = this.selectedModel;
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
