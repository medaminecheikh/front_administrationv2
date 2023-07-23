import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ListFactureComponent} from "../list-facture/list-facture.component";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-encaissement-facture',
  templateUrl: './encaissement-facture.component.html',
  styleUrls: ['./encaissement-facture.component.scss']
})
export class EncaissementFactureComponent implements OnInit, OnDestroy {
  ref: DynamicDialogRef | undefined;
  items!: MenuItem[];
  today:Date=new Date();
  factureForm !: FormGroup;
  total:any=1855.00;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService: UserService,
              private factureService: FactureService,
              private encaissementService: EncaissementService,
              private dialogService: DialogService
  ) {
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  ngOnInit(): void {
    this.initItems();
  }

  importFacture() {
    this.ref = this.dialogService.open(ListFactureComponent,
      {
        header: 'Select a Product',
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true
      });
  }

  private initItems() {
    this.items = [
      {
        tooltipOptions: {
          tooltipLabel: 'Delete',
          tooltipPosition:'bottom'
        },
        icon: 'pi pi-trash ',
        command: () => {

        }
      },

      {
        tooltipOptions: {
          tooltipLabel: 'Refresh',
          tooltipPosition:'bottom'
        },
        icon: 'pi pi-refresh',
        command: () => {

        }
      },

      {
        tooltipOptions: {
          tooltipLabel: 'Import',
          tooltipPosition:'left'
        },
        icon: 'pi pi-upload',
        command: () => {
          this.importFacture();
        },

      },
      {tooltipOptions: {
          tooltipLabel: 'Print',
          tooltipPosition:'left'
        },
        icon: 'pi pi-print'

      }
    ];
  }
}
