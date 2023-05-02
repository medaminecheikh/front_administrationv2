import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Model} from "../../../../modules/Model";
import {TreeNode} from "primeng/api";
import {catchError, from, mergeMap, of, switchMap, tap, throwError} from "rxjs";

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

  treeData: TreeNode[] = [];
  selectedFonc :Fonctionalite[]=[];
  selectedItems: TreeNode[] = [];


  constructor(private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}

  ngOnInit(): void {
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
    this.treeData.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }


  onSelectedItemsChange() {
    this.selectedFonc = this.selectedItems.map(value => value.data);

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


        this.router.navigate(['admin/model/add']).then(() => {
          // Reload the current page
          location.reload();});
        this.toastr.success('Model added successfully!', 'Success');
      });

    }else {
      this.showError=true;
      this.toastr.warning('Please fill the form correctly.', 'Warning');
    }
  }

}
