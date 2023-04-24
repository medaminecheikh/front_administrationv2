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
  files : TreeNode[] = [];
  selectedFonc :Fonctionalite[]=[];



  constructor(private router: Router,private formBuilder: FormBuilder,
              private toastr: ToastrService,private modelService:ModelService,
              private foncService:FonctionService) {}

  ngOnInit(): void {
this.foncService.getAllFoncs().subscribe(value => {
  this.files = this.transformToTreeNode(value);

})
    this.modelForm = this.formBuilder.group({
      obs: ['', [Validators.required, Validators.maxLength(30)]],
      desMOD: ['', [Validators.required, Validators.maxLength(100)]]
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
