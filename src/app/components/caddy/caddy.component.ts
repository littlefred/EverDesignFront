import { UsersServicesService } from './../../services/users-services.service';
import { ItemsServicesService } from './../../services/items-services.service';
import { Router } from '@angular/router';
import { CaddyServicesService } from './../../services/caddy-services.service';
import { OrdersContent } from './../../models/orders-content';
import { Component, OnInit } from '@angular/core';
import { Orders } from '../../models/orders';
import { Items } from '../../models/items';
import { Location } from '@angular/common';

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

  constructor(private caddyServices: CaddyServicesService, public router: Router,
    private itemsServices: ItemsServicesService, private location: Location, private usersServices: UsersServicesService) {
      this.caddyServices.getCaddyList().subscribe(
        (list) => {
          this.caddyInProgress = list;
        }
        );
        // method to follow the user connexion
        this.usersServices.getConnexion().subscribe(
          (value) => {this.statusConnexion = value; }
          );
        }

        ngOnInit() {
        }

        // method to call back an item of caddy
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

        // method to finish the caddy
        public finishIt(): void {
          this.router.navigateByUrl('/caddy');
        }

        // method to validate a caddy
        public validationOfCaddy(): void {
          if (this.statusConnexion) {
            console.log('check adresse');
            this.caddyStep = 'firstStep';
          } else {
            console.log('connexion user');
          }
        }

        // method to go back to the before page
        public callBack(): void {
          console.log('location back : ' + this.location.back());
          this.location.back();
        }

        // method to reset the caddy
        public resetCaddy(): void {
          this.caddyServices.deleteCaddy();
        }

        // method to reset the user order in progress
        public resetOrder(e: Event): void {
          e.preventDefault();
          console.log('reset order in progress');
        }

      }
