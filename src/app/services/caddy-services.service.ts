import { OrdersContent } from './../models/orders-content';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Items } from '../models/items';

@Injectable({
  providedIn: 'root'
})
export class CaddyServicesService {
  // Subject to follow the list of item that user want to buy
  private caddyList = new BehaviorSubject<OrdersContent[]>(new Array<OrdersContent>());

  constructor() { }

  // method to add an item in the user caddy
  public updateCaddy(item: Items, qty: number): void {
    let addItemInList = true;
    this.caddyList.getValue().forEach(element => {
      if (element.item === item) {
        element.qty += qty;
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
    this.caddyList = new BehaviorSubject<OrdersContent[]>(new Array<OrdersContent>());
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public getCaddyList(): Observable<OrdersContent[]> {
    return this.caddyList;
  }

}
