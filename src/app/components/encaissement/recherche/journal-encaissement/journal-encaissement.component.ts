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
import {DatePipe} from "@angular/common";

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
    myEncaiss: Encaissement[] = [];
    monthEncaiss: Encaissement[] = [];
    monthlyIncomeValue: number = 0.000;
    numberOfEncaissements: number = 0;

    constructor(private authService: AuthService, private userService: UserService
        , private ettService: EttService, private toastr: ToastrService, private caisseService: CaisseService
        , private encaissService: EncaissementService) {
    }

    ngOnInit(): void {
        this.getUser().then(() => {
            console.log("this.listEncaissment", this.listEncaissment)
            this.updateMonthEncaissements();
            console.log("monthEncaiss", this.monthEncaiss)
        });

    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
        this.ettSubscription.unsubscribe();
    }


    updateMonthEncaissements(): void {
        // Get the current date
        const currentDate = new Date();

        // Filter encaissements with dateEnc matching the current month and year
        this.monthEncaiss = this.listEncaissment.filter((encaissement) => {
            const encaissementDate = new Date(encaissement.dateEnc);
            return (
                encaissementDate.getMonth() === currentDate.getMonth() &&
                encaissementDate.getFullYear() === currentDate.getFullYear()
            );
        });

        // Calculate monthly income and update carouselOptions
        this.monthlyIncomeValue = this.monthlyIncome(this.monthEncaiss);
        this.numberOfEncaissements = this.monthEncaiss.length;
    }




    monthlyIncome(listEncaissment: Encaissement[]): number {
        // Calculate the sum of montantEnc for encaissements in the current month
        const sumMontantEnc = listEncaissment.reduce((total, encaissement) => {
            return total + encaissement.montantEnc;
        }, 0);

        // Calculate the average montantEnc
        return listEncaissment.length > 0
            ? sumMontantEnc
            : 0;
    }


    async getUser(): Promise<void> {
        return new Promise<void>((resolve) => {
            const name = this.authService.getCurrentUser();
            if (name && name.username) {
                this.userSubscription = this.userService.getUserBylogin(name.username).subscribe(
                    (value) => {
                        this.currentUser = value;
                    },
                    (error) => {
                        this.toastr.error('Could not get user detail!', 'Error');
                    },
                    () => {
                        this.getEtt();
                        this.myEncaissment();

                        resolve(); // Resolve the Promise when the operations are done.
                    }
                );
            } else {
                this.toastr.error('User resources not found!', 'Error');
                resolve(); // Resolve the Promise even if there's an error.
            }
        });
    }

    getEtt() {
        this.ettSubscription = this.ettService.getEtt(this.currentUser.ett.idEtt).subscribe(value => {
                this.ett = value;
                this.getAllEncaisses(value);
                console.log("value", value);
            },
            (error) => {
                this.toastr.error('Ett resources not found !', 'Error')
            }, () => {

            });
    }

    getAllEncaisses(ett: Ett) {
        console.log("ett", this.ett);

        if (ett) {
            if (ett.caisses) {
                ett.caisses.forEach(caisse => {
                    this.encaissService.getEncaissementByCaisse(caisse.idCaisse).subscribe((encaisses) => {
                        this.listEncaissment.push(...encaisses); // Use spread operator to push all encaissements
                        this.updateMonthEncaissements();
                    });
                });
            }
        } else {
            console.error("ett is undefined");
        }

    }

    myEncaissment() {
        this.encaissService.getEncaissementByCaisse(this.currentUser.caisse.idCaisse).subscribe(value => {
            this.myEncaiss = value;
        });
    }
}
