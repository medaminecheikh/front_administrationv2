import {Component, OnInit} from '@angular/core';
import {Profil} from "../../../../modules/Profil";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {Dregional} from "../../../../modules/Dregional";
import {Zone} from "../../../../modules/Zone";
import {ProfilService} from "../../../../services/profil.service";
import {ZoneService} from "../../../../services/zone.service";
import {UserService} from "../../../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {EttService} from "../../../../services/ett.service";
import {DrService} from "../../../../services/dr.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SECRET_KEY} from "../../../../guards/constants";
import {catchError, from, mergeMap, of, switchMap, tap, throwError} from "rxjs";
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  showError: boolean = false;
  zone = new FormControl();
  dreg = new FormControl();
  ett = new FormControl();
  utilisateurForm !: FormGroup;
  utilisateur!: Utilisateur;
  profils: Profil[] = [];
  profilSelected: Profil[] = [];
  zones: Zone[] = [];
  dreginals: Dregional[] = [];
  etts: Ett[] = [];
  ettselected: any;
  showPassword: boolean = false;
// Declare filteredProfils array
  filteredProfils: Profil[] = [];

  constructor(private zoneService: ZoneService,
              private dregionalService: DrService,
              private ettService: EttService,
              private router: Router, private formBuilder: FormBuilder,
              private toastr: ToastrService, private userService: UserService,
              private profilService: ProfilService) {
  }

  ngOnInit(): void {


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

    // Fetch all profiles
    this.profilService.getAllProfiles().subscribe((data: Profil[]) => {
      this.profils = data;
      // Initialize filteredProfils with all profiles
      this.filteredProfils = data.filter(profil => profil.nomP !== 'ADMIN');
    });




    this.utilisateurForm = this.formBuilder.group({
      login: ['', [Validators.required, this.noWhitespaceValidator]],
    nomU: ['', [Validators.required, this.noWhitespaceStartorEnd]],
    pwdU: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]],
    confirmedpassword: ['', Validators.required],
    prenU: ['', [Validators.required, this.noWhitespaceStartorEnd]],
    descU: ['', [Validators.required, this.noWhitespaceStartorEnd]],
    matricule: ['', [Validators.required, this.noWhitespaceStartorEnd]],
    estActif: ['', Validators.required],
    f_ADM_CEN: ["0", Validators.required],
    is_EXPIRED: ['', Validators.required],
    date_EXPIRED: ['', Validators.required]
  }, {validator: this.passwordMatchValidator});


    // Create valueChanges subscription for f_ADM_CEN
    this.utilisateurForm.get('f_ADM_CEN')?.valueChanges.subscribe(value => {
      if (value === "1") {
        // Filter and assign filteredProfils array
        this.filteredProfils = this.profils.filter(profil => profil.nomP === 'ADMIN');
      } else if (value === "0") {
        // Filter and assign filteredProfils array
        this.filteredProfils = this.profils.filter(profil => profil.nomP !== 'ADMIN');
      }
      // Reset the selected profil
      this.profilSelected = [];
    });

  }
  noWhitespaceValidator(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const hasWhitespace = value.includes(' ');
    return hasWhitespace ? { whitespace: true } : null;
  }
  noWhitespaceStartorEnd(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const trimmedValue = value.trim();
    const isValid = value === trimmedValue;
    return isValid ? null : { whitespace: true };
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

  onSelectionzone() {
    this.ett.reset();
    this.ettselected = null;
    this.etts = [];
  }


  addUser():void {

    if (this.utilisateurForm.valid) {
      const utilisateur = this.utilisateurForm.value;
      const profilSelected: Profil[] = this.profilSelected;
      const ettSelected: Ett | undefined | null = this.ettselected ? this.etts.find(e => e.idEtt === this.ettselected) : null; // use the find method to get the selected Ett object
      let userId: String;
      this.userService.addUser(utilisateur).pipe(
        tap((response) => {
          // Extract the idUser from the response and store it in userId variable
          userId = response.idUser;

        }),
        switchMap(() => {
          if (profilSelected.length === 0) {
            // Return an empty observable if profilSelected is empty
            return of(null);
          } else {
            // Emit each Profil object in profilSelected as a separate value
            return from(profilSelected).pipe(
              mergeMap((profil) => {
                return this.userService.affectProfilToUser(userId, profil.idProfil).pipe(
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
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('Login already exists !', 'Error');
              return throwError('Login already exists error !');
            }
          }
          this.toastr.error(error.error, 'Error');
          return throwError(error);
        })
      ).subscribe(() => {
          if (ettSelected) {
            this.userService.affecterUserToEtt(userId,ettSelected.idEtt).subscribe(
              () => {
                this.router.navigate(['admin/user/add']).then(() => {
                  // Reload the current page
                  location.reload();});
                this.toastr.success('User added successfully!', 'Success');
              },
              (error) => {
                this.toastr.error(error.error, 'Error');
              }
            );
          } else {
            this.router.navigate(['admin/user/add']).then(() => {
              // Reload the current page
              location.reload();});
            this.toastr.success('User added successfully!', 'Success');
          }
          // Handle success
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 404) {
              this.toastr.error('The resource could not be found.', 'Error');
            } else if (error.status === 401) {
              this.toastr.error('Login already exist error.', 'Error');
            }
          }
        }
      );
    } else {this.showError=true;
      this.toastr.warning('Please fill form correctly.', 'Warning');
    }
  }





}
