import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {TokenStorageService} from "../../../services/auth/token-storage.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  currentDate: Date = new Date();
  caisse:any
  constructor(private router: Router,private authService:AuthService,private tokenService:TokenStorageService) {}


  ngOnInit(): void {
this.caisse=this.tokenService.getUser().caisse;

console.log('!!!!!!!!',this.caisse)
  }


}
