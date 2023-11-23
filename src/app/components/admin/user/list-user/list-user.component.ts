import {Component, OnDestroy, OnInit} from '@angular/core';
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Page} from "../../../../modules/Page";
import {ZoneService} from "../../../../services/zone.service";
import {DrService} from "../../../../services/dr.service";
import {EttService} from "../../../../services/ett.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {ProfilService} from "../../../../services/profil.service";
import {Profil} from "../../../../modules/Profil";
import {Zone} from "../../../../modules/Zone";
import {Dregional} from "../../../../modules/Dregional";
import {Ett} from "../../../../modules/Ett";
import {ProfilUser} from "../../../../modules/ProfilUser";
import {catchError, forkJoin, Observable, Subscription} from "rxjs";
import {CaisseService} from "../../../../services/caisse.service";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit,OnDestroy {
  addedProfils: Profil[] = [];
  removedProfils: Profil[] = [];
  filtredProfils: Profil[] = [];
  showError: boolean = false;
  zone = new FormControl();
  dreg = new FormControl();
  ett = new FormControl();
  utilisateurForm !: FormGroup;
  utilisateurUpdate!: Utilisateur | null;
  profils: Profil[] = [];
  profilSelected: Profil[] = [];
  zones: Zone[] = [];
  dreginals: Dregional[] = [];
  etts: Ett[] = [];
  ettselected: any;
  showPassword: boolean = false;
  utlisateurs!: Utilisateur[];
  zoneSub:Subscription[]=[];
  keyword: string = '';
  userPage: Page = {
    totalPages: 0,
    totalElements: 0,
    last: false,
    first: false,
    size: 0,
    number: 0,
    numberOfElements: 0,
    content: []
  };
  page: number = 0;
  size: number = 10;
  pages: number[] = [];
  nom: string = '';
  prenom: string = '';
  estActif: string = '';

  constructor(private zoneService: ZoneService,
              private dregionalService: DrService,
              private ettService: EttService,
              private router: Router, private formBuilder: FormBuilder,
              private toastr: ToastrService, private userService: UserService,
              private profilService: ProfilService,
              private caisseService: CaisseService) {
  }

  ngOnDestroy(): void {
    this.zoneSub.forEach(value => value.unsubscribe());
    }


  ngOnInit(): void {
    this.searchUsers();
    this.fetchZones();
    this.subscribeToZoneChanges();
    this.subscribeToDregChanges();
    this.subscribeToEttChanges();
    this.initializeForm();
    this.getAllProfils();


  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('pwdU');
    const confirmPasswordControl = formGroup.get('confirmedpassword');

    if (!passwordControl || !confirmPasswordControl) {
      return; // One or both controls are null, so return early
    }
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;
    if (passwordControl.touched && confirmPasswordControl.touched && password !== confirmPassword) {
      confirmPasswordControl.setErrors({matchPassword: true});
    } else {
      confirmPasswordControl.setErrors(null);
    }
  }

  noWhitespaceStartorEnd(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const trimmedValue = value.trim();
    const isValid = value === trimmedValue;
    return isValid ? null : {whitespace: true};
  }

  getAllProfils() {
    this.profilService.getAllProfiles().subscribe((data: Profil[]) => {
      this.profils = data;
    });
  }

  onRowDoubleClick(user: Utilisateur) {
    this.Clear();
    this.utilisateurUpdate = user;
    this.utilisateurForm.patchValue({
      login: user.login,
      idUser: user.idUser,
      nomU: user.nomU,
      prenU: user.prenU,
      descU: user.descU,
      matricule: user.matricule,
      estActif: user.estActif,
      f_ADM_LOC: user.f_ADM_LOC,
      f_ADM_CEN: user.f_ADM_CEN,
      is_EXPIRED: user.is_EXPIRED,
      date_EXPIRED: user.date_EXPIRED
    });

    this.profilSelected = user.profilUser.map(value => value.profil);
    this.updateFiltredProfils();
    // Create valueChanges subscription for f_ADM_CEN
    this.utilisateurForm.get('f_ADM_CEN')?.valueChanges.subscribe(value => {
      this.updateFiltredProfils();
    });
    this.etts =  this.utilisateurUpdate?.ett?.dregional?.etts.filter(value => {
      return  value.idEtt !== this.utilisateurUpdate?.ett?.idEtt});
    this.ett.setValue(this.utilisateurUpdate?.ett?.idEtt);
    this.dreginals = this.utilisateurUpdate.ett?.dregional?.zone?.dregionals;
  }

  private updateFiltredProfils() {
    this.filtredProfils = this.profils.filter(profil => {
      if (this.utilisateurForm.get('f_ADM_CEN')?.value === "1") {

        return profil.nomP === 'ADMIN' && !this.profilSelected.some(selected => selected.idProfil === profil.idProfil);
      } else {
        return profil.nomP !== 'ADMIN' && !this.profilSelected.some(selected => selected.idProfil === profil.idProfil);
      }
    });
  }

  onAddProfil(event: any) {
    console.log('onAddProfil called');
    console.log('event:', event);
    console.log('this.profilSelected:', this.profilSelected);
    if (event && event.items && event.items.length) {
      const addedProfils = event.items.filter((item: Profil) =>
        !this.utilisateurUpdate?.profilUser.some(
          (profilUser: ProfilUser) => profilUser.profil.idProfil === item.idProfil
        )
      );
      console.log('addedProfils:', addedProfils);
      this.addedProfils.push(...addedProfils);
      console.log('this.addedProfils:', this.addedProfils);
    }
  }

  onRemoveProfil(event: any) {
    console.log('onRemoveProfil called');
    console.log('event:', event);
    console.log('this.profilSelected:', this.profilSelected);
    if (event && event.items && event.items.length) {
      const removedProfils = event.items;
      console.log('removedProfils:', removedProfils);
      this.removedProfils.push(...removedProfils);
      console.log('this.removedProfils:', this.removedProfils);
    }
  }

  AllRemove($event: any) {
    console.log('AllRemove called');

    console.log('this.profilSelected:', this.profilSelected);
    const removedProfils = this.utilisateurUpdate?.profilUser.filter((profilUser: ProfilUser) =>
      !this.profilSelected.some((item: Profil) => item.idProfil === profilUser.profil.idProfil)
    ).map((profilUser: ProfilUser) => profilUser.profil); // only pass Profil objects to this.removedProfils
    console.log('removedProfils:', removedProfils);
    this.removedProfils.push(...(removedProfils ?? []));
    console.log('this.removedProfils:', this.removedProfils);
    this.addedProfils = [];
  }


  AllAdd($event: any) {
    console.log('AllToAdd called');

    console.log('this.profilSelected:', this.profilSelected);
    const addedProfils = this.profilSelected.filter((item: Profil) =>
      !this.utilisateurUpdate?.profilUser.some(
        (profilUser: ProfilUser) => profilUser.profil.idProfil === item.idProfil
      )
    );
    console.log('addedProfils:', addedProfils);
    this.addedProfils.push(...addedProfils);
    console.log('this.addedProfils:', this.addedProfils);

    this.removedProfils = [];

  }

  onSelectionzone() {
    this.ett.reset();
    this.ettselected = null;
    this.etts = [];
  }

  searchUsers() {

    this.userService.searchUserpage(this.keyword, this.nom, this.prenom, this.estActif, this.page, this.size)
      .subscribe(data => {
        this.utlisateurs = data;
        this.userPage.content = data;
        if (data.length > 0) {
          this.userPage.totalPages = Math.ceil(data[0].totalElements / this.size);
        }
        this.updatePages();
      });


  }

  updatePages() {
    if (this.userPage.totalPages <= 5) {
      this.pages = Array(this.userPage.totalPages).fill(0).map((x, i) => i);
    } else if (this.page < 3) {
      this.pages = [0, 1, 2, 3, -1, this.userPage.totalPages - 1];
    } else if (this.page >= this.userPage.totalPages - 3) {
      this.pages = [0, -1, this.userPage.totalPages - 4, this.userPage.totalPages - 3, this.userPage.totalPages - 2, this.userPage.totalPages - 1];
    } else {
      this.pages = [0, -1, this.page - 1, this.page, this.page + 1, -1, this.userPage.totalPages - 1];
    }

    if (this.page == 0) {
      this.userPage.first = true;
    } else {
      this.userPage.first = false;
    }
    if (this.page == this.userPage.totalPages - 1) {
      this.userPage.last = true;
    } else {
      this.userPage.last = false;
    }
  }

  goToPage(n: number) {
    this.page = n;
    this.searchUsers();
  }

  onNext() {
    this.page++;
    this.searchUsers();
  }

  onPrev() {
    this.page--;
    this.searchUsers();
  }

  onPageChange(event: any) {
    this.page = event.target.value;
    this.searchUsers();
  }


  Clear() {
    this.utilisateurUpdate = null;
    this.utilisateurForm.reset();
    this.ett.reset();
    this.zone.reset();
    this.dreg.reset();
    this.profilSelected = [];
    this.getAllProfils();
    this.addedProfils = [];
    this.removedProfils = [];
  }


  update() {
    const utilisateur = this.utilisateurForm.value;
    const pwd = this.utilisateurForm.controls['pwdU'].value;
    const confirmedPwd = this.utilisateurForm.controls['confirmedpassword'].value;
    const updateUser=this.utilisateurUpdate;
    if ((pwd && confirmedPwd) || (!pwd && !confirmedPwd)) {
      // Password and confirmed password are both present or both absent
      if (this.utilisateurForm.valid || (!pwd && !confirmedPwd)) {
        // Form is valid or password and confirmed password are both absent
        const requests: Observable<any>[] = [];


        if (this.addedProfils) {
          for (const profil of this.addedProfils) {
            if (!(this.utilisateurForm.get('f_ADM_CEN')?.value === '0' && profil.nomP === 'ADMIN')) {
              requests.push(this.userService.affectProfilToUser(utilisateur.idUser, profil.idProfil));
            }
          }
        }

        if (this.removedProfils) {
          for (const profil of this.removedProfils) {
            console.log("sssssssssssss", profil);
            requests.push(this.userService.removeProfil(utilisateur.idUser, profil.idProfil));
          }
        }

        if (this.ettselected ) {
          console.log("ettselected", this.ettselected)
          if (this.ettselected!==updateUser?.ett?.idEtt ) {
            requests.push(this.caisseService.removeUser(utilisateur.idUser));

          }
          requests.push(this.userService.affecterUserToEtt(utilisateur.idUser, this.ettselected));


            console.log(":::::: SEND IT !!!!!")



        }
        if (utilisateur) {
          requests.push(this.userService.updateUser(utilisateur));
        }

        forkJoin(requests).pipe(
          catchError((err) => {
            console.error(err);
            // Error handling logic here
            return err;
          })
        ).subscribe((res) => {
          // Success logic here
          this.router.navigate(['admin/user/dashboard']).then(() => {
            // Reload the current page
            location.reload();
          });

          this.toastr.success('Utilisateur modifié avec succès.');

        }, (err) => {
          // Revert all sends and show error message
          this.toastr.error('Une erreur s\'est produite lors de la modification de l\'utilisateur.');
          for (const request of requests) {
            request.subscribe(() => {
            }, () => {
            });
          }
        },()=>{});
      } else {
        this.toastr.error('Veuillez remplir tous les champs obligatoires et respecter les contraintes de validation.');
      }
    } else {
      this.toastr.error('Veuillez confirmer votre mot de passe.');
    }
  }

  refresh() {
    this.router.navigate(['admin/user/dashboard']).then(() => {
      // Reload the current page
      location.reload();
    });
  }


  resetFilter() {
    this.nom = '';
    this.prenom = '';
    this.keyword = '';
    this.estActif = '';
    this.size = 10;

  }

  fetchZones() {
    // Fetch the list of zones on component initialization
    this.zoneService.getZones().subscribe(
      zones => this.zones = zones,
      error => console.error(error)
    );
  }

  private subscribeToZoneChanges() {
    // Subscribe to the value changes of the zone form control
  const zone= this.zone.valueChanges.subscribe(
      zoneId => {
        this.onSelectionzone();
        // Fetch the associated dreginals when the zone value changes
        if (zoneId) {
          const selectedZone = this.zones.find(zone => zone.idZone === zoneId);
          if (selectedZone) {
          const dr= this.dregionalService.getDregionalsByZone(selectedZone.idZone).subscribe(
              dreginals => {
                this.dreginals = dreginals;
                this.dreg.reset();
                this.ett.reset();
              },
              error => console.error(error)
            );
            this.zoneSub.push(dr);
          }
        } else {
          this.dreg.reset();
          this.ett.reset();
          this.dreginals = [];
          this.etts = [];
        }
      }
    );
    this.zoneSub.push(zone);

  }

  private subscribeToDregChanges() {
    // Subscribe to the value changes of the dreg form control
    const dreg= this.dreg.valueChanges.subscribe(
      dregId => {
        this.onSelectionzone();
        // Fetch the associated etts when the dreg value changes
        if (dregId) {
          const selectedDreg = this.dreginals.find(dreg => dreg.idDr === dregId);
          if (selectedDreg) {
          const ett= this.ettService.getEttsByDrId(selectedDreg.idDr).subscribe(
              etts => {
                this.etts = etts;
                this.ett.reset(); // reset the ett form control
                this.ettselected = null; // reset the selected ett
              },
              error => console.error(error)
            );
            this.zoneSub.push(ett);
          } else {
            this.dreg.reset();
            this.ett.reset();
            this.dreginals = [];
            this.etts = [];
          }
        }
      }
    );
    this.zoneSub.push(dreg);
  }

  private subscribeToEttChanges() {
    // Subscribe to the value changes of the dreg form control
    this.ett.valueChanges.subscribe(value => this.ettselected = value);
  }

  private initializeForm() {
    this.utilisateurForm = this.formBuilder.group({
      login: [''],
      idUser: [''],
      nomU: ['', this.noWhitespaceStartorEnd],
      pwdU: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]],
      confirmedpassword: [null, Validators.required],
      prenU: ['', this.noWhitespaceStartorEnd],
      descU: ['', this.noWhitespaceStartorEnd],
      matricule: ['', this.noWhitespaceStartorEnd],
      estActif: [''],
      f_ADM_CEN: [''],
      is_EXPIRED: [''],
      date_EXPIRED: ['']
    }, {validator: this.passwordMatchValidator});
  }


}
