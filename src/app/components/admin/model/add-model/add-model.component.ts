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
