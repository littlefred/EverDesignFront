import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Items } from '../models/items';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Resolve, Router } from '@angular/router';
import { Colors } from '../models/colors';

@Injectable({
  providedIn: 'root'
})
export class ItemsServicesService implements Resolve<number> {
  private errorMessage: string; // to manage error messages
  // attribut to save the backend address
  private readonly URL_ITEMS = environment.backEndUrl + '/items';
  // attribut to save the choice of category
  private categoryIdSelected = -1;
  // attribut to save the initial list of all items
  private initialGlobalListItems = new Array<Items>();
  // BehaviorSubject to manage the selection list
  private selectedListItems = new BehaviorSubject<Items[]>(new Array<Items>());
  // attribut to define the display of item component since navigation choice
  screenObs = new BehaviorSubject<string>('');
  // BehaviorSubject to define one item to display some details since navigation choice
  private seeItem = new BehaviorSubject<Items>(new Items());

  constructor(private http: HttpClient, private router: Router) {
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

  // method Resolve that was implemented to manage the routeur link whitout good informations
  resolve(): number {
    if (this.categoryIdSelected !== -1) {
      return this.categoryIdSelected;
    } else {
      this.router.navigate(['']);
      return null;
    }
  }

  // method to call backend and get all categories
  public getAllItems(): Observable<Items[]> {
    return this.http.get<Items[]>(this.URL_ITEMS);
  }

  // method to check the stock of an item
  public getStock(idItem: number): Observable<number> {
    return this.http.get<number>(this.URL_ITEMS + '/stock/' + idItem);
  }

  // method to send a request to upload files of new item(s)
  sendPics(formdata: FormData): Observable<HttpEvent<{}>> {
    const req = new HttpRequest('POST', this.URL_ITEMS + '/upload', formdata, {reportProgress: true});
    return this.http.request(req);
  }

  // method to send a request to upload one file only
  sendPic(formdata: FormData): Observable<HttpEvent<{}>> {
    const req = new HttpRequest('POST', this.URL_ITEMS + '/uploadColors', formdata, {reportProgress: true});
    return this.http.request(req);
  }

  // method to send a request to save new item(s)
  sendItems(items: Items[]): Observable<HttpEvent<{}>> {
    const req = new HttpRequest('POST', this.URL_ITEMS + '/new', items, {reportProgress: true});
    return this.http.request(req);
  }

  // method to send a request to save new item(s)
  sendMaterial(material: Colors): Observable<HttpEvent<{}>> {
    const req = new HttpRequest('POST', this.URL_ITEMS + '/newColors', material, {reportProgress: true});
    return this.http.request(req);
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public getErrorMessage(): string {
    return this.errorMessage;
  }

  public setCategoryIdSelected(id: number): void {
    this.categoryIdSelected = id;
    this.selectedListItems.next(this.initialGlobalListItems.filter(item => item.category.id === this.categoryIdSelected));
  }

  public getCategoryIdSelected(): number {
    return this.categoryIdSelected;
  }

  public getInitialGlobalListItems(): Items[] {
    return this.initialGlobalListItems;
  }

  public setInitialGlobalListItems(items: Items[]): void {
    this.initialGlobalListItems = items;
  }

  public getSelectedListItems(): Observable<Items[]> {
    return this.selectedListItems;
  }

  public getScreenObs(): BehaviorSubject<string> {
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
