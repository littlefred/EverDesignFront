import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Categories } from '../models/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesServicesService {
  // attribut to save the backend address
  private readonly URL_CATEGORIES = environment.backEndUrl + '/categories';

  constructor(private http: HttpClient) { }

  // method to call backend and get all categories
  public getAllCategories(): Observable<Categories[]> {
    return this.http.get<Categories[]>(this.URL_CATEGORIES);
  }
}
