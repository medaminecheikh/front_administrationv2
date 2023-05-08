import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Page} from "../../../../modules/Page";
import {ZoneService} from "../../../../services/zone.service";
import {DrService} from "../../../../services/dr.service";
import {EttService} from "../../../../services/ett.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {ProfilService} from "../../../../services/profil.service";
import {Profil} from "../../../../modules/Profil";
import {Zone} from "../../../../modules/Zone";
import {Dregional} from "../../../../modules/Dregional";
import {Ett} from "../../../../modules/Ett";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit{


  showError: boolean = false;
  zone = new FormControl();
  dreg = new FormControl();
  ett = new FormControl();
  utilisateurForm !: FormGroup;
  utilisateurUpdate!: Utilisateur |null;
  profils: Profil[] = [];
  profilSelected: Profil[] = [];
  zones: Zone[] = [];
  dreginals: Dregional[] = [];
  etts: Ett[] = [];
  ettselected: any;
  showPassword: boolean = false;
  utlisateurs!:Utilisateur[];
  keyword: string = '';
  userPage: Page = {
    totalPages: 0,
    totalElements: 0,
    last: false,
    first: false,
    size: 0,
    number: 0,
    numberOfElements: 0,
    content:[]
  };
  page: number = 0;
  size: number=8;
  pages: number[] = [];
  constructor(private zoneService: ZoneService,
              private dregionalService: DrService,
              private ettService: EttService,
              private router: Router, private formBuilder: FormBuilder,
              private toastr: ToastrService, private userService: UserService,
              private profilService: ProfilService) {
  }

  update() {

  }

  ngOnInit(): void {
    this.searchUsers();


    // Fetch the list of zones on component initialization
    this.zoneService.getZones().subscribe(
      zones => this.zones = zones,
      error => console.error(error)
    );
    // Subscribe to the value changes of the zone form control
    this.zone.valueChanges.subscribe(
      zoneId => {
        this.onSelectionzone();
        // Fetch the associated dreginals when the zone value changes
        if (zoneId) {
          const selectedZone = this.zones.find(zone => zone.idZone === zoneId);
          if (selectedZone){this.dregionalService.getDregionalsByZone(selectedZone.idZone).subscribe(
            dreginals => {
              this.dreginals = dreginals;
              this.dreg.reset();
              this.ett.reset();
            },
            error => console.error(error)
          );}
        } else {
          this.dreg.reset();
          this.ett.reset();
          this.dreginals = [];
          this.etts = [];
        }
      }
    );
    // Subscribe to the value changes of the dreg form control
    this.dreg.valueChanges.subscribe(
      dregId => {
        this.onSelectionzone();
        // Fetch the associated etts when the dreg value changes
        if (dregId) {
          const selectedDreg = this.dreginals.find(dreg => dreg.idDr === dregId);
          if(selectedDreg){
            this.ettService.getEttsByDrId(selectedDreg.idDr).subscribe(
              etts => {
                this.etts = etts;
                this.ett.reset(); // reset the ett form control
                this.ettselected = null; // reset the selected ett
              },
              error => console.error(error)
            );}
          else {
            this.dreg.reset();
            this.ett.reset();
            this.dreginals = [];
            this.etts = [];
          }
        }
      }
    );
    // Subscribe to the value changes of the dreg form control
    this.ett.valueChanges.subscribe(value => this.ettselected=value);

    this.profilService.getAllProfiles().subscribe((data: Profil[]) => {
      this.profils = data;
    });



    this.utilisateurForm = this.formBuilder.group({
      login: ['', Validators.required],
      nomU: ['', Validators.required],
      pwdU: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]],
      confirmedpassword: ['', Validators.required],
      prenU: ['', Validators.required],
      descU: ['', Validators.required],
      matricule: ['', Validators.required],
      estActif: ['', Validators.required],
      f_ADM_CEN: ['', Validators.required],
      is_EXPIRED: ['', Validators.required],
      date_EXPIRED: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
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

  onRowDoubleClick(user: Utilisateur) {
    this.utilisateurUpdate = user;
    this.utilisateurForm.patchValue({
      login:user.login,
      idUser:user.idUser,
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

  }


  onSelectionzone() {
    this.ett.reset();
    this.ettselected = null;
    this.etts = [];
  }

  searchUsers() {
    this.userService.searchUserpage(this.keyword, this.page, this.size)
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
  ChangeSize() {
    this.searchUsers();
  }

  Clear() {
    this.utilisateurUpdate=null;
    this.utilisateurForm.reset();
  }
}
