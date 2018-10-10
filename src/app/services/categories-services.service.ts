import { Categories } from './../models/categories';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
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
    public getAllCategories(): Observable<Categories[]> {
      return this.http.get<Categories[]>(this.URL_CATEGORIES);
    }

    // method to get all colors for items
    public getAllColors(): Observable<Colors[]> {
      return this.http.get<Colors[]>(this.URL_CATEGORIES + '/colors');
    }

    // method to send a request to upload file of new category
    sendPic(formdata: FormData): Observable<HttpEvent<{}>> {
      const req = new HttpRequest('POST', this.URL_CATEGORIES + '/upload', formdata, {reportProgress: true});
      return this.http.request(req);
    }

    // method to send a request to save new item(s)
    sendCategory(cat: Categories): Observable<HttpEvent<{}>> {
      const req = new HttpRequest('POST', this.URL_CATEGORIES + '/new', cat, {reportProgress: true});
      return this.http.request(req);
    }

    /**********************
    **********************
    * GETTERS AND SETTERS
    **********************
    *********************/

    public getCategoriesList(): Observable<Categories[]> {
      return this.categoriesList;
    }

    public setCategoriesList(categoriesList: Categories[]): void {
      this.categoriesList.next(categoriesList);
    }

    public getErrorMessage(): string {
      return this.errorMessage;
    }
  }
