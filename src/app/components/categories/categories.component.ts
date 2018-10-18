import { UsersServicesService } from './../../services/users-services.service';
import { environment } from './../../../environments/environment.prod';
import { ItemsServicesService } from './../../services/items-services.service';
import { CategoriesServicesService } from './../../services/categories-services.service';
import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/categories';
import { Router } from '@angular/router';
import { Positions } from '../../tools/positions.enum';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  errorMessage: string; // to manage error messages
  categories: Categories[]; // to keep the list of all categories
  pathPics = environment.srcUrlCategoriesPics; // path to get pictures of categories
  statusConnexion: boolean;
  userPosition: Positions;

  constructor(private categoriesServices: CategoriesServicesService, public router: Router,
    private itemsServices: ItemsServicesService, private usersServices: UsersServicesService,
    private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.categoriesServices.getCategoriesList().subscribe(
      (categories: Categories[]) => {
        if (categories.length > 0) {
          this.categories = categories;
        } else {
          this.errorMessage = this.categoriesServices.getErrorMessage();
        }
      }
    );
    // method to follow the user connexion
    this.usersServices.getConnexion().subscribe(
      (value) => {this.statusConnexion = value; }
    );
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

  // method to selection a category
  public selectedCategory(id: number): void {
    this.itemsServices.setCategoryIdSelected(id);
    this.itemsServices.setScreenObs('');
    this.router.navigateByUrl('/items');
  }

  // method to add an item
  addItem(id: number): void {
    this.itemsServices.setCategoryIdSelected(id);
    this.itemsServices.setScreenObs('editionItem');
  }

  // method to add a category
  addCategory(e: Event): void {
    e.preventDefault();
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        view: 'addCategory'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'okSvg' ) {
        // alert('Votre catégorie a bien été créée');
        this.snackBar.open('Votre catégorie a bien été créée', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snackbar']
        });
      }
    });
  }

}
