import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrdersContent } from './../models/orders-content';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  /**********************
  * METHODS FOR CADDY
  *********************/

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

  /**********************
  * METHODS FOR ORDER
  *********************/

  // method to cancel the order in progress
  public deletedOrderInProgress(userId: number): Observable<any> {
    const id = this.orderInProgress.getValue().id.toString();
    return this.http.delete(this.URL_ORDERS, {params: {orderId: id, userId: userId.toString()}});
  }

  // method to update the order status
  public updateStatusOrder(order: Orders): Observable<Orders> {
    return this.http.put(this.URL_ORDERS, order);
  }

  // method to get an order in progress of user (order before paid)
  public getOrderInProgressBeforePaid(userId: number): void {
    this.http.get(this.URL_ORDERS + '?userId=' + userId).subscribe(
      (result: Orders) => {
        this.orderInProgress.next(result);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.log('Pas de commandes en cours pour cet utilisateur');
          this.orderInProgress.next(new Orders());
        } else {
          console.log(error);
        }
      }
    );
  }

  // method to reset the user order in progress when user disconnected
  public cleanOrderInProgress(): void {
    this.orderInProgress.next(new Orders());
  }

  // method to save an order in DB
  public saveCaddy(order: Orders): Observable<Orders> {
    return this.http.post(this.URL_ORDERS, order);
  }

  // method to update the order delivery address
  public updateOrderAddress(order: Orders): Observable<Orders> {
    return this.http.put(this.URL_ORDERS, order);
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public getCaddyList(): Observable<OrdersContent[]> {
    return this.caddyList;
  }

  public setCaddyList(orderContent: OrdersContent[]): void {
    this.caddyList.next(orderContent);
  }

  public getOrderInProgress(): Observable<Orders> {
    return this.orderInProgress;
  }

  public setOrderInProgress(order: Orders): void {
    this.orderInProgress.next(order);
  }

}
