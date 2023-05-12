import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {

  }
}
