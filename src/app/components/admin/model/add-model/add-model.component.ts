import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Model} from "../../../../modules/Model";
import {TreeNode} from "primeng/api";
import {SECRET_KEY} from "../../../../guards/constants";
import {catchError, from, mergeMap, of, switchMap, tap, throwError} from "rxjs";
import CryptoJS from 'crypto-js';

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
  selectedFiles!: TreeNode[];
  files : TreeNode[] = [];
  selectedFonc :Fonctionalite[]=[];



  constructor(private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}

  ngOnInit(): void {
this.foncService.getAllFoncs().subscribe(value => {
  this.files = this.transformToTreeNode(value);
this.expandAll();
})
    this.modelForm = this.formBuilder.group({
      obs: ['', [Validators.required, Validators.maxLength(30)]],
      desMOD: ['', [Validators.required, Validators.maxLength(100)]]
    });


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
        children: []
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


  onFileSelectionChange(event: any) {

     this.selectedFonc =this.selectedFiles.map(node => node.data);

  }

  addModel() {
    if (this.modelForm.valid)
    {const model = this.modelForm.value;
      const selectedFonc: Fonctionalite[] = this.selectedFonc;
      let modelId: String;
      this.modelService.addModel(model).pipe(
        tap((response) => {
          // Extract the idUser from the response and store it in modelId variable
          modelId = response.idModel;

        }),switchMap(() => {
          if (selectedFonc.length === 0) {
            // Return an empty observable if selectedFonc is empty
            return of(null);
          } else {
            // Emit each Fonc object in selectedFonc as a separate value
            return from(selectedFonc).pipe(
              mergeMap((fonc) => {
                return this.foncService.affecterModelToFonc( modelId,fonc.idFonc).pipe(
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
          this.toastr.error(error.error, 'Error');

          return throwError(error);
        })
      ).subscribe(() => {

        const id = CryptoJS.AES.encrypt(modelId.trim(), SECRET_KEY).toString();
        this.router.navigate(['admin/model/detail',id]);
        this.toastr.success('Model added successfully!', 'Success');
      });

    }else {
      this.showError=true;
      this.toastr.warning('Please fill the form correctly.', 'Warning');
    }
  }

}
