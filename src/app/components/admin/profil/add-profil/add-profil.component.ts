import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Profil} from "../../../../modules/Profil";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Model} from "../../../../modules/Model";
import {ProfilService} from "../../../../services/profil.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";
import {catchError, concatMap, finalize, from, last, map, mapTo, of, tap, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {TreeNode} from "primeng/api";


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

    this.getAllModels();
    this.initializeProfilForm();
    this.getAllFonctions();
    this.subscribeToModelChanges();

  }
  noWhitespaceStartorEnd(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const trimmedValue = value.trim();
    const isValid = value === trimmedValue;
    return isValid ? null : { whitespace: true };
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
  onSelectedItemsChange() {
    this.selectedFonc = this.selectedItems
      .filter(item => !this.selectedModel?.fonctions.some(fonc => fonc.idFonc === item.data.idFonc))
      .map(item => item.data);
    console.log(this.selectedFonc )
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


  addProfil(): void {
    if (this.profilForm.valid) {
      const profil = this.profilForm.value;
      const selectedFonc: Set<Fonctionalite> = new Set(this.selectedFonc);
      let profilId: string;
      const selectedModel: Model | undefined = this.selectedModel;

      this.profilService.addProfile(profil).pipe(
        tap((response: Profil) => {
          profilId = response.idProfil;
        }),
        concatMap(() => {
          if (selectedFonc.size === 0) {
            return of(profilId);
          } else {
            const distinctFoncIds = Array.from(new Set([...selectedFonc].map(fonc => fonc.idFonc)));
            return from(distinctFoncIds).pipe(
              concatMap((idFonc: string) => {
                if (!selectedModel?.fonctions.some(fonc => fonc.idFonc === idFonc)) {
                  return this.profilService.affecterFonctionaliteToProfile(idFonc, profilId).pipe(
                    catchError((error) => {
                      this.toastr.error(error.error, 'Error');
                      return throwError(error);
                    })
                  );
                } else {
                  return of(null);
                }
              }),
              last(), // Ensure all assignments are completed before moving to the next step
              mapTo(profilId) // Return the profilId after function assignments
            );
          }
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 403) {
              this.toastr.error('Nom Profil already exists!', 'Error');
              return throwError('Nom Profil already exists error!');
            }
          }
          this.toastr.error(error.error, 'Error');
          return throwError(error);
        }),
        finalize(() => {
          if (selectedModel) {
            this.profilService.affecterModelToProfile(selectedModel.idModel, profilId).subscribe(
              () => {
                this.handleSuccessNavigation();
                this.toastr.success('Profil added successfully!', 'Success');
              },
              (error) => {
                this.handleError(error);
              }
            );
          } else {
            this.handleSuccessNavigation();
            this.toastr.success('profil added successfully!', 'Success');
          }
        })
      ).subscribe();
    } else {
      this.showError = true;
      this.toastr.warning('Please fill the form correctly.', 'Warning');
    }
  }


  private handleSuccessNavigation(): void {
    this.router.navigate(['admin/profil/add']).then(() => {
      // Reload the current page
      location.reload();
    });
  }

  private handleError(error: any): void {
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


  private getAllModels() {
    this.modelService.getAllModels().subscribe((data :Model[]) => {
      this.models = data;

    });
  }

  private initializeProfilForm() {
    this.profilForm= this.formBuilder.group({
      nomP: ['', [Validators.required, Validators.maxLength(30),this.noWhitespaceStartorEnd]],
      des_P: ['', [Validators.required, Validators.maxLength(100),this.noWhitespaceStartorEnd]]
    });
  }

  private getAllFonctions() {
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

  private subscribeToModelChanges() {
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
}
