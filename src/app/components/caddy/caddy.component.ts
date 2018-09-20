import { UsersServicesService } from './../../services/users-services.service';
import { ItemsServicesService } from './../../services/items-services.service';
import { Router } from '@angular/router';
import { CaddyServicesService } from './../../services/caddy-services.service';
import { OrdersContent } from './../../models/orders-content';
import { Component, OnInit } from '@angular/core';
import { Orders } from '../../models/orders';
import { Items } from '../../models/items';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Status } from '../../tools/status.enum';

@Component({
  selector: 'app-caddy',
  templateUrl: './caddy.component.html',
  styleUrls: ['./caddy.component.scss']
})
export class CaddyComponent implements OnInit {
  orderInProgress: Orders; // attribut to manage a user order in progress
  caddyInProgress: OrdersContent[]; // attribut to manage user purchases
  statusConnexion: boolean; // to know if user is connected
  caddyStep: string; // to manage the display of steps of caddy
  // user: Users; // to follow informations of user when is connected

  constructor(private caddyServices: CaddyServicesService, public router: Router,
    private itemsServices: ItemsServicesService, private location: Location,
    private usersServices: UsersServicesService, private dialog: MatDialog) {}

  ngOnInit() {
    // instruction to follow the user connexion
    this.usersServices.getConnexion().subscribe((value) => {this.statusConnexion = value; });
    // instruction to get the caddy list in progress
    this.caddyServices.getCaddyList().subscribe((list) => {this.caddyInProgress = list; });
    // instruction to get the order in progress
    this.caddyServices.getOrderInProgress().subscribe((value) => {this.orderInProgress = value; });
    console.log(this.orderInProgress);
  }

  // method to display details of an item of caddy
  public callBackItem(item: Items): void {
    this.itemsServices.setCategoryIdSelected(item.category.id);
    this.itemsServices.setScreenObs('detailsItem');
    this.itemsServices.setSeeItem(item);
    this.router.navigateByUrl('/items');
  }

  // method to calcul the global cost of a list
  public getTotalCost(list: OrdersContent[]): string {
    let cost = 0;
    list.forEach(line => cost += (line.item.discountPrice ? line.item.discountPrice : line.item.price) * line.qty);
    cost = cost / 100;
    return cost.toFixed(2);
  }

  // method to finalise the caddy
  public finishIt(): void {
    this.router.navigateByUrl('/caddy');
  }

  // method to validate a caddy
  public validationOfCaddy(): void {
    if (this.statusConnexion) {
      this.caddyStep = 'firstStep';
      this.makeOrder();
      console.log(this.orderInProgress);
      this.caddyServices.saveCaddy(this.orderInProgress);
    } else {
      const dialogRef = this.dialog.open(DialogComponent, {
        data : {
          view: 'cnx'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result === 'cnxOK') {
          this.caddyStep = 'firstStep';
          this.makeOrder();
          this.caddyServices.saveCaddy(this.orderInProgress);
        }
      });
    }
  }

  // method to go back to the before page
  public callBack(): void {
    this.location.back();
  }

  // method to reset the caddy
  public resetCaddy(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        update: 'reset',
        message: 'Voulez-vous vider votre panier ?',
        view: 'removeConfirm'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.caddyServices.deleteCaddy();
        if (this.router.url === '/caddy') {this.router.navigateByUrl(''); }
      }
    });
  }

  // method to reset the user order in progress
  public resetOrder(e: Event): void {
    e.preventDefault();
    console.log('reset order in progress');
  }

  // method to delete an item
  public deleteItem(item: Items): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: item.name,
        view: 'removeConfirm'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.caddyServices.updateCaddy(item, 0);
      }
    });
  }

  // method to generate an order since the caddy
  public makeOrder(): void {
    const user = this.usersServices.getUser();
    if (this.orderInProgress === undefined) {
      this.orderInProgress = new Orders();
      this.orderInProgress.dateOfCreation = new Date();
      this.orderInProgress.numberOrder = user.lastName +
        + new Date().getDate() + (new Date().getMonth() + 1) + new Date().getFullYear()
        + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
      this.orderInProgress.user = user;
      this.orderInProgress.dateOfStep = new Date();
      this.orderInProgress.status = Status.NOVALIDATED;
      this.orderInProgress.address = user.street + '\n'
        + user.zipCode + '\n' + user.city + '\n'
        + user.country;
      this.orderInProgress.listOrderItems = this.caddyInProgress;
    } else {
      console.log('old order');
    }
  }

}
