import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  username!:any;
  constructor(private router: Router,private authService:AuthService) {}

  Logout() {
    this.authService.logout();
  }
  ngOnInit(): void {
    this.username= this.authService.getCurrentUser()?.username;


  }


}
