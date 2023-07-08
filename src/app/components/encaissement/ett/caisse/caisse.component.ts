import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Caisse} from "../../../../modules/Caisse";
import {Utilisateur} from "../../../../modules/Utilisateur";
import {ZoneService} from "../../../../services/zone.service";
import {DrService} from "../../../../services/dr.service";
import {EttService} from "../../../../services/ett.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {CaisseService} from "../../../../services/caisse.service";
import {Ett} from "../../../../modules/Ett";
import {catchError, map, of, Subscription, switchMap, throwError} from "rxjs";
import {AuthService} from "../../../../services/auth/auth.service";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent implements OnInit, OnDestroy {

  listCaisse: Caisse[] = [];
  caisseForm!: FormGroup;
  caisse!: Caisse;
  usersfromett: Utilisateur[] = [];
  userselected!: String | null;
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;

  constructor(
    private zoneService: ZoneService,
    private dregionalService: DrService,
    private authService: AuthService,
    private ettService: EttService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private caisseService: CaisseService,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getUser();


  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();

  }

  getUser() {
    const name = this.authService.getCurrentUser()
    if (name && name.username) {
      this.userSubscription = this.userService.getUserBylogin(name.username).subscribe(
        (value) => {
          this.currentUser = value
        }
        , (error) => {
          this.toastr.error('Could not get user detail !', 'Error')
        },
        () => {
          this.getEtt();
        });
    } else
      this.toastr.error('User resources not found !', 'Error')
  }

  getEtt() {
    this.ettSubscription = this.ettService.getEtt(this.currentUser.ett.idEtt).subscribe(value => {
        this.ett = value;
        this.usersfromett = [];
      },
      error => {
        this.toastr.error('Ett resources not found !', 'Error')
      }, () => {
        this.searchCaisse();
        this.caisseDispo();
        this.getUsersFromEtt();
      });
  }

  searchCaisse(): void {
    if (this.ett) {

      this.caisseService.getCaissesByEttId(this.ett.idEtt).subscribe((value) => {
        this.listCaisse = value;
      })
    }
  }


  caisseDispo(): number[] {
    const selectedEtt = this.ett;
    if (selectedEtt) {
      const assignedNumCaiseValues = selectedEtt.caisses.map((caisse) => caisse.numCaise);
      const allNumCaiseValues = Array.from({length: 10}, (_, i) => i + 1);
      return allNumCaiseValues.filter((numCaise) => !assignedNumCaiseValues.includes(numCaise));
    }
    return [];
  }

  getUsersFromEtt() {
    if (this.ett) {
      const ettselected = this.ett.idEtt
      this.ettService.getEtt(ettselected).subscribe((value) => {
        this.usersfromett = value.utilisateurs.filter((user) => {
          return user.profilUser.some((profilUser) => profilUser.profil.nomP === 'FO')
            && !user.caisse;
        });
        this.userselected = null; // Reset the user selection
        console.log(this.usersfromett);
      });
    }

  }


  initializeForm(): void {
    this.caisseForm = this.formBuilder.group({
      numCaise: ['', Validators.required],
      f_Actif: ['0', Validators.required]
    });
  }


  addCaisse() {
    if (this.caisseForm.valid) {
      const caisse = this.caisseForm.value;
      const user = this.userselected;
      const ettid = this.ett.idEtt;

      this.caisseService.addCaisse(caisse).pipe(
        switchMap((response) => {
          const idCaisse = response.idCaisse;
          let observableChain = of(null);

          if (ettid) {
            observableChain = observableChain.pipe(
              switchMap(() => this.caisseService.affecterCaisseToEtt(idCaisse, ettid)),
              map(() => null) // Transform the emitted value to null
            );
          }
          console.log("user", user)
          if (user) {
            observableChain = observableChain.pipe(
              switchMap(() => this.caisseService.affecterCaisseToUser(idCaisse, user)),
              map(() => null) // Transform the emitted value to null
            );
          }

          return observableChain.pipe(
            catchError((error) => {
              // Rollback the changes if an error occurs
              return this.rollbackChanges(idCaisse, error);
            })
          );
        })
      ).subscribe(
        () => {
          // Success
          this.router.navigate(['encaissement/ett/caisse']).then(() => {
            // Reload the current page
            location.reload();
          });
          this.toastr.success('Caisse added successfully.');
        },
        (error) => {
          // Handle error
          this.toastr.error('Error occurred while adding caisse.', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please fill the form correctly.', 'Warning');
    }
  }


  rollbackChanges(idCaisse: string, error: any) {
    // Delete the caisse if it was created
    if (idCaisse) {
      this.caisseService.deleteCaisse(idCaisse).subscribe();
    }

    // Handle specific error scenarios and display appropriate messages
    if (error.status === 409) {
      // Handle conflict error
      this.toastr.error('Conflict error occurred.', 'Error');
    } else {
      // Handle generic errors
      this.toastr.error('Error occurred.', 'Error');
    }

    return throwError(error);
  }


  confirmDelete(idCaisse: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Caisse',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      accept: () => {
        // Handle the accept action
        this.deleteCaisse(idCaisse);

      },
      reject: () => {
        // Handle the reject action
      }
    });
  }

  deleteCaisse(caisseId: string): void {
    this.caisseService.deleteCaisse(caisseId).subscribe(() => {
      // Call the searchCaisse() method to refresh the list of caisses
      this.searchCaisse();
    }, error => () => {
    }, () => {
      this.getEtt();
      this.toastr.success('Caisse deleted successfully.');
    });
  }
}
