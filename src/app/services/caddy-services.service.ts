import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrdersContent } from './../models/orders-content';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Items } from '../models/items';
import { Orders } from '../models/orders';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CaddyServicesService {
  // attribut to save the backend address
  private readonly URL_ORDERS = environment.backEndUrl + '/orders';
  // BehaviorSubject to follow the list of item that user want to buy
  private caddyList = new BehaviorSubject<OrdersContent[]>(new Array<OrdersContent>());
  // Subject to follow the order in progress that user want to buy
  private orderInProgress = new BehaviorSubject<Orders>(new Orders());

  constructor(private http: HttpClient) {}

  // method to add an item in the user caddy
  public updateCaddy(item: Items, qty: number): void {
    let addItemInList = true;
    this.caddyList.getValue().forEach(element => {
      if (element.item === item) {
        if (qty > 0) {
          element.qty += qty;
        } else {
          this.caddyList.getValue().splice(this.caddyList.getValue().indexOf(element), 1);
        }
        addItemInList = false;
      }
    });
    if (addItemInList) {
      const newItemToBuy = new OrdersContent(item, qty);
      this.caddyList.getValue().push(newItemToBuy);
    }
  }

  // method to reset the user caddy
  public deleteCaddy(): void {
    this.caddyList.next(new Array<OrdersContent>());
  }

  // method to reset the user order in progress
  public deleteOrderInProgress(): void {
    this.orderInProgress.next(new Orders());
  }

  // method to save an order in DB
  public saveCaddy(order: Orders): void {
    this.http.post(this.URL_ORDERS, order).subscribe(
      (value: Orders) => {
        this.caddyList.next(new Array<OrdersContent>());
        this.orderInProgress.next(value);
      }
    );
  }

  // method to get an order in progress of user (order before paid)
  public getOrderInProgressBeforePaid(userId: number): void {
    this.http.get(this.URL_ORDERS + '?userId=' + userId).subscribe(
      (result: Orders) => {this.orderInProgress.next(result); },
      (error: HttpErrorResponse) => {console.log(error); }
    );
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public getCaddyList(): Observable<OrdersContent[]> {
    return this.caddyList;
  }

  public getOrderInProgress(): Observable<Orders> {
    return this.orderInProgress;
  }

}
