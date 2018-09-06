import { OrdersContent } from './../../models/orders-content';
import { Component, OnInit } from '@angular/core';
import { Orders } from '../../models/orders';

@Component({
  selector: 'app-caddy',
  templateUrl: './caddy.component.html',
  styleUrls: ['./caddy.component.css']
})
export class CaddyComponent implements OnInit {
  private orderInProgress: Orders; // attribut to manage a user order in progress
  private caddyInProgress: OrdersContent[]; // attribut to manage user purchases

  constructor() { }

  ngOnInit() {
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public getOrderInProgress(): Orders {
    return this.orderInProgress;
  }

  public getCaddyInProgress(): OrdersContent[] {
    return this.caddyInProgress;
  }

}
