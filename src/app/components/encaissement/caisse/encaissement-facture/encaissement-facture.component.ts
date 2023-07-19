import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-encaissement-facture',
  templateUrl: './encaissement-facture.component.html',
  styleUrls: ['./encaissement-facture.component.scss']
})
export class EncaissementFactureComponent implements OnInit, OnDestroy{
  ref: DynamicDialogRef | undefined;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService: UserService,
              private factureService:FactureService,
              private encaissementService:EncaissementService,
              private dialogService: DialogService
              ) {
  }
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  ngOnInit(): void {
  }

  importFacture() {

  }
}
