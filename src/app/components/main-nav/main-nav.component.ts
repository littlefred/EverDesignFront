import { Positions } from './../../tools/positions.enum';
import { UsersServicesService } from './../../services/users-services.service';
import { ItemsServicesService } from './../../services/items-services.service';
import { CategoriesServicesService } from './../../services/categories-services.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categories } from '../../models/categories';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  categories: Categories[]; // to keep the list of all categories
  statusConnexion: boolean;
  userPosition: Positions;

  @Output() eventToClose = new EventEmitter();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver,
    private categoriesServices: CategoriesServicesService,
    public router: Router, private dialog: MatDialog,
    public itemsServices: ItemsServicesService, private usersServices: UsersServicesService) {
    // method to get all categories since categoriesServices
    this.categoriesServices.getCategoriesList().subscribe((categories: Categories[]) => {this.categories = categories; });
    // method to follow the user connexion
    this.usersServices.getConnexion().subscribe(
      (value) => {this.statusConnexion = value; }
    );
  }

  // method when user click on a category
  public selectedCategory(id: number): void {
    this.itemsServices.setCategoryIdSelected(id);
    this.itemsServices.setScreenObs('');
  }

  // method when user go out of catalog (home or contact)
  public resetCategories(): void {
    this.itemsServices.setCategoryIdSelected(-1);
  }

  // method to get the user position when he's connected
  public getUserPosition(): boolean {
    if (this.statusConnexion) {
      this.userPosition = this.usersServices.getUser().position;
      return true;
    } else {
      return false;
    }
  }

  // method to call the dialogue page to do the connection
  public getConnection(e: Event): void {
    e.preventDefault();
    this.dialog.open(DialogComponent, {
      data : {
        view: 'cnx'
      }
    });
  }

  // method to do the deconnection
  public getDeconnection(e: Event): void {
    e.preventDefault();
    this.usersServices.deconnection();
  }

}
