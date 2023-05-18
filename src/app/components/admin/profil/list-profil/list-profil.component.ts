import {Component, OnInit} from '@angular/core';
import {Profil} from "../../../../modules/Profil";
import {Page} from "../../../../modules/Page";

@Component({
  selector: 'app-list-profil',
  templateUrl: './list-profil.component.html',
  styleUrls: ['./list-profil.component.scss']
})
export class ListProfilComponent implements OnInit{
  userPage: Page = {
    totalPages: 0,
    totalElements: 0,
    last: false,
    first: false,
    size: 0,
    number: 0,
    numberOfElements: 0,
    content: []
  };
  page: number = 0;
  size: number = 10;
  pages: number[] = [];
  profilUpdate!: Profil;

  constructor() {
  }

  ngOnInit(): void {
  }
  Clear() {

  }

  refresh() {

  }



  updatePages() {
    if (this.userPage.totalPages <= 5) {
      this.pages = Array(this.userPage.totalPages).fill(0).map((x, i) => i);
    } else if (this.page < 3) {
      this.pages = [0, 1, 2, 3, -1, this.userPage.totalPages - 1];
    } else if (this.page >= this.userPage.totalPages - 3) {
      this.pages = [0, -1, this.userPage.totalPages - 4, this.userPage.totalPages - 3, this.userPage.totalPages - 2, this.userPage.totalPages - 1];
    } else {
      this.pages = [0, -1, this.page - 1, this.page, this.page + 1, -1, this.userPage.totalPages - 1];
    }

    if (this.page == 0) {
      this.userPage.first = true;
    } else {
      this.userPage.first = false;
    }
    if (this.page == this.userPage.totalPages - 1) {
      this.userPage.last = true;
    } else {
      this.userPage.last = false;
    }
  }

  goToPage(n: number) {
    this.page = n;
    this.searchProfils();
  }

  onNext() {
    this.page++;
    this.searchProfils();
  }

  onPrev() {
    this.page--;
    this.searchProfils();
  }

  searchProfils() {

  }

  resetFilter() {

  }
}
