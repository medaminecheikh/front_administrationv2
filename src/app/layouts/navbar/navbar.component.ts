import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {MenuItem} from "primeng/api";
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  items !: MenuItem[];
  username!:any;
  constructor(private router: Router,private authService:AuthService) {}

  navigateToQuit() {
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    this.username= this.authService.getCurrentUser()?.username;

    this.items = [

      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus'
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Filter',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Print',
                    icon: 'pi pi-fw pi-print'
                  }
                ]
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'List'
              }
            ]
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.navigateToQuit()
      }

    ];
  }


}
