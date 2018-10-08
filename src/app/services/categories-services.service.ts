import { Categories } from './../models/categories';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Colors } from '../models/colors';

@Injectable({
  providedIn: 'root'
})
export class CategoriesServicesService {
  // attribut to save the backend address
  private readonly URL_CATEGORIES = environment.backEndUrl + '/categories';
  // attribut to save the categories list
  private categoriesList = new BehaviorSubject<Categories[]>(new Array<Categories>());
  private errorMessage: string; // to manage error messages

  constructor(private http: HttpClient) {
    this.getAllCategories().subscribe(
      (categories: Categories[]) => {
        this.categoriesList.next(categories);
        console.log('=> Initial global list of categories :');
        console.log(this.categoriesList.getValue());
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage = 'erreur technique :\nDésolé, actuellement aucune information. Merci de réessayer ultérieurement';
        }
      }
      );
    }

    // method to call backend and get all categories
    private getAllCategories(): Observable<Categories[]> {
      return this.http.get<Categories[]>(this.URL_CATEGORIES);
    }

    // method to get all colors for items
    public getAllColors(): Observable<Colors[]> {
      return this.http.get<Colors[]>(this.URL_CATEGORIES + '/colors');
    }

    /*getLoadingPic(fileName: string) {
      return this.http.get(this.URL_CATEGORIES + '/loading/' + fileName);
    }*/

    /**********************
    **********************
    * GETTERS AND SETTERS
    **********************
    *********************/

    public getCategoriesList(): Observable<Categories[]> {
      return this.categoriesList;
    }

    public getErrorMessage(): string {
      return this.errorMessage;
    }
  }
