import { environment } from './../../../environments/environment.prod';
import { ItemsServicesService } from './../../services/items-services.service';
import { CategoriesServicesService } from './../../services/categories-services.service';
import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/categories';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  errorMessage: string; // to manage error messages
  categories: Categories[]; // to keep the list of all categories
  pathPics = environment.srcUrlCategoriesPics; // path to get pictures of categories

  constructor(private categoriesServices: CategoriesServicesService, public router: Router, private itemsServices: ItemsServicesService) {}

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
  }

  // method to selection a category
  public selectedCategory(id: number): void {
    this.itemsServices.setCategoryIdSelected(id);
    this.router.navigateByUrl('/items');
  }

  /*uploadPic(fileName: string) {
    this.categoriesServices.getLoadingPic(fileName);
  }*/

}
