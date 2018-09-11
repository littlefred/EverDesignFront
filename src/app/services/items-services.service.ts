import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Items } from '../models/items';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ItemsServicesService {
  private errorMessage: string; // to manage error messages
  // attribut to save the backend address
  private readonly URL_ITEMS = environment.backEndUrl + '/items';
  // attribut to save the choice of category
  private categoryIdSelected = -1;
  // attribut to save the initial list of all items
  private initialGlobalListItems = new Array<Items>();
  // attribut to save the selection list
  private selectedListItems = new BehaviorSubject<Items[]>(new Array<Items>());
  // Subject to define the display of item component since navigation choice
  private screenObs = new BehaviorSubject<string>('');
  // Subject to define one item to display some details since navigation choice
  private seeItem = new BehaviorSubject<Items>(new Items());

  constructor(private http: HttpClient) {
    this.getAllItems().subscribe(
      (items: Items[]) => {
        this.initialGlobalListItems = items;
        console.log('=> Initial global list of items :');
        console.log(this.initialGlobalListItems);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 404) {this.errorMessage = 'erreur technique :\nDésolé, actuellement aucun article trouvé.'; }
      }
    );
  }

  // method to call backend and get all categories
  private getAllItems(): Observable<Items[]> {
    return this.http.get<Items[]>(this.URL_ITEMS);
  }

  // method to modify the screenItem attribut of items component
  public updateScreenItems(s: string): void {
    this.screenObs.next(s);
  }

  public getStock(idItem: number): Observable<number> {
    return this.http.get<number>(this.URL_ITEMS + '/stock/' + idItem);
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public setCategoryIdSelected(id: number): void {
    this.categoryIdSelected = id;
    this.selectedListItems.next(this.initialGlobalListItems.filter(item => item.category.id === this.categoryIdSelected));
  }

  public getCategoryIdSelected(): number {
    return this.categoryIdSelected;
  }

  public setErrorMessage(message: string): void {
    this.errorMessage = message;
  }

  public getErrorMessage(): string {
    return this.errorMessage;
  }

  public getInitialGlobalListItems(): Items[] {
    return this.initialGlobalListItems;
  }

  public getSelectedListItems(): Observable<Items[]> {
    return this.selectedListItems;
  }

  public setSelectedListItems(items: Items[]): void {
    this.selectedListItems.next(items);
  }

  public getScreenObs(): Observable<string> {
    return this.screenObs;
  }

  public setScreenObs(screen: string): void {
    this.screenObs.next(screen);
  }

  public getSeeItem(): Observable<Items> {
    return this.seeItem;
  }

  public setSeeItem(item: Items): void {
    this.seeItem.next(item);
  }

}
