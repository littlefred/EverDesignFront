import { LengthDatas } from './../../tools/length-datas.enum';
import { Countries } from './../../tools/countries.enum';
import { Status } from './../../tools/status.enum';
import { HttpErrorResponse } from '@angular/common/http';
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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateCountry } from '../../tools/customvalidators';

@Component({
  selector: 'app-caddy',
  templateUrl: './caddy.component.html',
  styleUrls: ['./caddy.component.scss']
})
export class CaddyComponent implements OnInit {
  errorMessage: string; // attribut to save error message
  orderInProgress: Orders; // attribut to manage a user order in progress
  caddyInProgress: OrdersContent[]; // attribut to manage user purchases
  statusConnexion: boolean; // to know if user is connected
  caddyStep: string; // to manage the display of steps of caddy
  isEditable = false; // boolean to know if order address is updated or not for user
  // list of enumeration Countries
  countries = Countries;
  // instruction to control the formulaire to change order address
  updateStreet = new FormGroup({
    street: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_STREET),
      Validators.pattern('[\'a-zA-Z0-9 ]*')]),
    zipCode: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_ZIPCODE),
      Validators.pattern('[a-zA-Z0-9 ]*')]),
    city: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_CITY), Validators.pattern('[\'a-zA-Z -]*')]),
    country: new FormControl(Countries.FRANCE, [Validators.required, Validators.maxLength(LengthDatas.DATA_COUNTRY), ValidateCountry])
  });

  constructor(private caddyServices: CaddyServicesService, public router: Router,
    private itemsServices: ItemsServicesService, private location: Location,
    public usersServices: UsersServicesService, private dialog: MatDialog) {}

  ngOnInit() {
    // instruction to follow the user connexion
    this.usersServices.getConnexion().subscribe((value) => {this.statusConnexion = value; });
    // instruction to get the caddy list in progress
    this.caddyServices.getCaddyList().subscribe((list) => {this.caddyInProgress = list; });
    // instruction to get the order in progress
    this.caddyServices.getOrderInProgress().subscribe((value) => {this.orderInProgress = value; });
    // reset error message
    this.errorMessage = '';
  }

  /**********************
  * METHODS FOR CADDY
  *********************/

  // method to display details of an item of caddy
  public callBackItem(item: Items): void {
    this.itemsServices.setCategoryIdSelected(item.category.id);
    this.itemsServices.setScreenObs('detailsItem');
    this.itemsServices.setSeeItem(item);
    this.router.navigateByUrl('/items');
    this.errorMessage = '';
  }

  // method to finalise the caddy
  public finishIt(): void {
    this.router.navigateByUrl('/caddy');
    this.errorMessage = '';
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

  // method to validate a caddy
  public validationOfCaddy(): void {
    if (this.statusConnexion) {
      this.makeOrder();
      this.caddyServices.saveCaddy(this.orderInProgress).subscribe(
        (result: Orders) => {
          this.caddyServices.setCaddyList(new Array<OrdersContent>());
          this.caddyServices.setOrderInProgress(result);
          this.errorMessage = '';
          this.caddyStep = 'firstStep';
        },
        (error: HttpErrorResponse) => {
          if (error.status === 500) {
            console.log(error);
            console.log('Erreur technique : la commande n\'a pas été sauvegardée.');
          }
        }
      );
    } else {
      const dialogRef = this.dialog.open(DialogComponent, {data : {view: 'cnx'}});
      dialogRef.afterClosed().subscribe(result => {
        if (result && result === 'cnxOK') {
          this.makeOrder();
          this.caddyServices.saveCaddy(this.orderInProgress).subscribe(
            (returnValue: Orders) => {
              this.caddyServices.setCaddyList(new Array<OrdersContent>());
              this.caddyServices.setOrderInProgress(returnValue);
              this.errorMessage = '';
              this.caddyStep = 'firstStep';
            },
            (error: HttpErrorResponse) => {
              if (error.status === 500) {
                console.log(error);
                console.log('Erreur technique : la commande n\'a pas été sauvegardée.');
              }
            }
          );
        }
      });
    }
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

  /**********************
  * METHODS FOR ORDER
  *********************/

  // method to finalize an order
  public finishOrder(): void {
    this.caddyStep = 'firstStep';
    this.errorMessage = '';
  }

  // method to confirm order address
  public goodAddress(): void {
    if (this.orderInProgress.status === Status.NOVALIDATED) {
      this.orderInProgress.status = Status.VALIDATED;
    }
    this.orderInProgress.dateOfStep = new Date();
    this.caddyServices.updateStatusOrder(this.orderInProgress).subscribe(
      (result: Orders) => {
        this.caddyServices.setOrderInProgress(result);
        this.errorMessage = '';
        this.caddyStep = 'secondStep';
      },
      (error: HttpErrorResponse) => {
        if (error.status === 304) {this.errorMessage = 'Erreur technique :\nnous n\'avons pas pu modifier votre commande.'; }
      }
    );
  }

  // method to reset the user order in progress
  public resetOrder(e: Event): void {
    e.preventDefault();
    this.caddyServices.deletedOrderInProgress(this.usersServices.getUser().id).subscribe(
      (result) => {
        console.log(result);
        if (result) {
          this.caddyServices.getOrderInProgressBeforePaid(this.usersServices.getUser().id);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.errorMessage = 'Erreur technique :\nnous n\'avons pas pu supprimer votre commande.';
      }
    );
  }

  // method to update address of order
  public updateAddressOrder(value): void {
    const city = (value.city).toUpperCase();
    const newAddress = value.street + '\n' + value.zipCode + ' ' + city + '\n' + value.country;
    this.orderInProgress.address = newAddress;
    if (this.orderInProgress.status === Status.NOVALIDATED) {
      this.orderInProgress.status = Status.VALIDATED;
    }
    this.orderInProgress.dateOfStep = new Date();
    this.caddyServices.updateOrderAddress(this.orderInProgress).subscribe(
      (result: Orders) => {
        this.caddyServices.setOrderInProgress(result);
        this.caddyStep = 'secondStep';
      },
      (error: HttpErrorResponse) => {
        if (error.status === 304) {this.errorMessage = 'Erreur technique :\nnous n\'avons pas pu modifier votre commande'; }
      }
    );
  }

  /**********************
  * OTHER METHODS
  *********************/

  // method to calcul the global cost of a list
  public getTotalCost(list: OrdersContent[]): string {
    let cost = 0;
    list.forEach(line => cost += (line.item.discountPrice ? line.item.discountPrice : line.item.price) * line.qty);
    cost = cost / 100;
    return cost.toFixed(2);
  }

  // method to calcul the items count of a list
  public getTotalItems(list: OrdersContent[]): number {
    let count = 0;
    list.forEach(line => count += line.qty);
    return count;
  }

  // method to go back to the before page
  public callBack(): void {
    this.location.back();
  }

  // method to edit a new address for the order
  public editAddress(): void {
    this.isEditable = true;
  }

  // method to canceled the address order edition
  public editCancelAddress(): void {
    this.isEditable = false;
  }

  // method to generate an order since the caddy
  public makeOrder(): void {
    const user = this.usersServices.getUser();
    if (this.orderInProgress.numberOrder === undefined) {
      this.orderInProgress = new Orders();
      this.orderInProgress.dateOfCreation = new Date();
      this.orderInProgress.numberOrder = user.lastName +
        + new Date().getDate() + (new Date().getMonth() + 1) + new Date().getFullYear()
        + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
      this.orderInProgress.user = user;
      this.orderInProgress.dateOfStep = new Date();
      this.orderInProgress.status = Status.NOVALIDATED;
      this.orderInProgress.address = user.street + '\n'
        + user.zipCode + ' ' + user.city + '\n'
        + user.country;
      this.orderInProgress.listOrderItems = this.caddyInProgress;
    } else {
      console.log('old order');
      this.caddyInProgress.forEach((e) => {this.orderInProgress.listOrderItems.push(e); });
      this.orderInProgress.dateOfStep = new Date();
    }
  }

}
