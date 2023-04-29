import {Component, OnInit} from '@angular/core';
import {Profil} from "../../../../modules/Profil";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
  ettselected !: Ett | null;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

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
      zone => {
        // Fetch the associated dreginals when the zone value changes
        if (zone) {
          this.dregionalService.getDregionalsByZone(zone.idZone).subscribe(
            dreginals => this.dreginals = dreginals,
            error => console.error(error)
          );
        }
      }
    );
    // Subscribe to the value changes of the dreg form control
    this.dreg.valueChanges.subscribe(
      dreg => {
        // Fetch the associated etts when the dreg value changes
        if (dreg) {
          this.ettService.getEttsByDrId(dreg.idDr).subscribe(
            etts => this.etts = etts,
            error => console.error(error)
          );
        }
      }
    );


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
    f_ADM_LOC: ['', Validators.required],
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




  addUser():void {

    if (this.utilisateurForm.valid) {
      const utilisateur = this.utilisateurForm.value;
      const profilSelected: Profil[] = this.profilSelected;
      const ettSelected : Ett | null = this.ettselected;
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
            if (error.status === 403) {
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
                const id = CryptoJS.AES.encrypt(userId.trim(), SECRET_KEY).toString();
                this.router.navigate(['detail-user',id])
                this.toastr.success('User added successfully!', 'Success');
              },
              (error) => {
                this.toastr.error(error.error, 'Error');
              }
            );
          } else {
            const id = CryptoJS.AES.encrypt(userId.trim(), SECRET_KEY).toString();
            this.router.navigate(['detail-user',id])
            this.toastr.success('User added successfully!', 'Success');
          }
          // Handle success
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 404) {
              this.toastr.error('The resource could not be found.', 'Error');
            } else if (error.status === 401) {
              this.toastr.error('Unauthorized request.', 'Error');
            } else if (error.status === 403) {
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
