import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  username:any
  constructor(private router: Router,private authService:AuthService) {}
  ngOnInit(): void {
    this.username= this.authService.getCurrentUser()?.username;
  }
  Logout() {
    this.authService.logout();
  }
}
