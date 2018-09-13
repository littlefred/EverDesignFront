import { Positions } from './../../tools/positions.enum';
import { UsersServicesService } from './../../services/users-services.service';
import { ItemsServicesService } from './../../services/items-services.service';
import { CategoriesServicesService } from './../../services/categories-services.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categories } from '../../models/categories';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  categories: Categories[]; // to keep the list of all categories
  statusConnexion: boolean;

  @Output() eventToClose = new EventEmitter();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver,
    private categoriesServices: CategoriesServicesService,
    public router: Router,
    public itemsServices: ItemsServicesService, private usersServices: UsersServicesService) {
      // method to get all categories since categoriesServices
      this.categoriesServices.getAllCategories().subscribe(
        (categories: Categories[]) => {
          this.categories = categories;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
      // method to follow the user connexion
      this.usersServices.getConnexion().subscribe(
        (value) => {this.statusConnexion = value; }
      );
    }

    // method when user click on a category
    public selectedCategory(id: number): void {
      console.log('cat choisie => ' + id);
      this.itemsServices.setCategoryIdSelected(id);
      this.itemsServices.updateScreenItems('');
      // this.router.navigateByUrl('/items');
    }

    // method when user go out of catalog (home or contact)
    public resetCategories(): void {
      this.itemsServices.setCategoryIdSelected(-1);
    }

    // method to have the user position when he's connected
    public getStatusUser(): Positions {
      return this.usersServices.getPositions();
    }

  }
