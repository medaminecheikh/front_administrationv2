import {Component, OnDestroy, OnInit} from '@angular/core';
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {Subscription} from "rxjs";
import {AuthService} from "../../../../services/auth/auth.service";
import {UserService} from "../../../../services/user.service";
import {EttService} from "../../../../services/ett.service";
import {ToastrService} from "ngx-toastr";
import {Encaissement} from "../../../../modules/Encaissement";
import {CaisseService} from "../../../../services/caisse.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-journal-encaissement',
  templateUrl: './journal-encaissement.component.html',
  styleUrls: ['./journal-encaissement.component.scss']
})
export class JournalEncaissementComponent implements OnInit, OnDestroy {
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  listEncaissment: Encaissement[] = [];
  filtredEncaissment: Encaissement[] = [];
  myEncaiss:Encaissement[] = [];
  constructor(private authService: AuthService, private userService: UserService
    , private ettService: EttService, private toastr: ToastrService, private caisseService: CaisseService
    , private encaissService: EncaissementService) {
  }

  ngOnInit(): void {
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
          this.myEncaissment();
        });
    } else
      this.toastr.error('User resources not found !', 'Error')
  }

  getEtt() {
    this.ettSubscription = this.ettService.getEtt(this.currentUser.ett.idEtt).subscribe(value => {
        this.ett = value;
        console.log("value", value);
      },
      (error) => {
        this.toastr.error('Ett resources not found !', 'Error')
      },()=>{
        this.getAllEncaisses();
      })
  }

  getAllEncaisses() {
    console.log("ett", this.ett);

    if (this.ett) {
      if (this.ett.caisses) {
        this.ett.caisses.forEach(caisse => {
          this.encaissService.getEncaissementByCaisse(caisse.idCaisse).subscribe((encaisses) => {
            encaisses.forEach(value => this.listEncaissment.push(value));
          });
        });
      }
    } else {
      console.error("ett is undefined");
    }
  }

  myEncaissment() {
    this.encaissService.getEncaissementByCaisse(this.currentUser.caisse.idCaisse).subscribe(value => {
      this.myEncaiss=value;
    });
  }
}
