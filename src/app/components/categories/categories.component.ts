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

  constructor(private categoriesServices: CategoriesServicesService,
    public router: Router,
    private itemsServices: ItemsServicesService) {
      this.categoriesServices.getAllCategories().subscribe(
        (categories: Categories[]) => {
          this.categories = categories;
          console.log('=> Initial global list of categories :');
          console.log(this.categories);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          if (error.status === 404) {this.errorMessage = 'Désolé, actuellement aucune rubrique n\'est disponible.'; }
        }
      );
    }

    ngOnInit() {
    }

    public selectedCategory(id: number): void {
      this.itemsServices.setCategoryIdSelected(id);
      this.router.navigateByUrl('/items');
    }

  }
