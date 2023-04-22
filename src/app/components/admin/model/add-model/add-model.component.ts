import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ModelService} from "../../../../services/model.service";
import {FonctionService} from "../../../../services/fonction.service";
import {Fonctionalite} from "../../../../modules/Fonctionalite";
import {Model} from "../../../../modules/Model";
import {TreeNode} from "primeng/api";


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

  selectedFonc :Fonctionalite[]=[];
  functionalites  : Fonctionalite[] = [
    {codF: "1", desF: "Fonctionalite 1", f_ADM: 0, f_DROIT_ACCES: 1, fon_COD_F: "", idFonc: "1", models: [], nomF: "Fonctionalite 1", nomMENU: "Menu 1",profils:[],totalElements:0},
    {codF: "2", desF: "Fonctionalite 2", f_ADM: 0, f_DROIT_ACCES: 1, fon_COD_F: "", idFonc: "2", models: [], nomF: "Fonctionalite 2", nomMENU: "Menu 2",profils:[],totalElements:0},
    {codF: "3", desF: "Sous-fonctionalite 1 de Menu 1", f_ADM: 0, f_DROIT_ACCES: 1, fon_COD_F: "Menu 1_1", idFonc: "3", models: [], nomF: "Sous-fonctionalite 1 de Menu 1", nomMENU: "Menu 1",profils:[],totalElements:0},
    {codF: "4", desF: "Sous-fonctionalite 2 de Menu 1", f_ADM: 0, f_DROIT_ACCES: 1, fon_COD_F: "Menu 1_2", idFonc: "4", models: [], nomF: "Sous-fonctionalite 2 de Menu 1", nomMENU: "Menu 1",profils:[],totalElements:0},
    {codF: "5", desF: "Sous-fonctionalite 1 de Menu 2", f_ADM: 0, f_DROIT_ACCES: 1, fon_COD_F: "Menu 2_1", idFonc: "5", models: [], nomF: "Sous-fonctionalite 1 de Menu 2", nomMENU: "Menu 2",profils:[],totalElements:0}

  ];
  files : TreeNode[] = [];




  constructor(private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}

  ngOnInit(): void {

    this.modelForm = this.formBuilder.group({
      obs: ['', [Validators.required, Validators.maxLength(30)]],
      desMOD: ['', [Validators.required, Validators.maxLength(100)]]
    });
    this.files = this.transformToTreeNode(this.functionalites);
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

    console.log(this.selectedFiles)

     this.selectedFonc =this.selectedFiles.map(node => node.data);
      console.log('Selected Fonctionalites:', this.selectedFonc);

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
