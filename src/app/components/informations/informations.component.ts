import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
export class InformationsComponent implements OnInit {
  page: string;

  constructor(public router: Router) {
    if (this.router.url === '/informations/ML') {
      this.page = 'ML';
    }
    if (this.router.url === '/informations/CGV') {
      this.page = 'CGV';
    }
  }

  ngOnInit() {
  }

}
