import { CaddyServicesService } from './../../services/caddy-services.service';
import { Items } from './../../models/items';
import { ItemsServicesService } from './../../services/items-services.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  // formControl to manage the disable action in select option
  disableSelect = new FormControl(false);
  // to manage error messages
  private errorMessage: string;
  // attribut to save the list of items selection
  private listItemsToDisplay: Items[];
  // attribut to manage the type of display of item(s)
  private screenItems: string;
  // attribut to save the item to display details
  private itemDetails: Items;
  // list of item to display on function of page
  private pagingList: Items[];
  // attribut to get the stock of an item
  private stockItem: number;

  constructor(private itemsServices: ItemsServicesService, private caddyServices: CaddyServicesService) {}

  ngOnInit() {
    this.errorMessage = this.itemsServices.getErrorMessage();
    this.itemsServices.getSelectedListItems().subscribe(
      (items: Items[]) => {
        this.pagingList = new Array<Items>();
        this.listItemsToDisplay = items.sort((a, b) => a.name.localeCompare(b.name));
        if (this.listItemsToDisplay.length === 0) {
          this.errorMessage = 'Désolé, aucun article trouvé.';
        } else {
          this.errorMessage = '';
          this.pagingList = this.listItemsToDisplay.slice(0, Math.min(6, this.listItemsToDisplay.length));
        }
      }
    );
    this.itemsServices.getScreenObs().subscribe(
      (string) => {
        this.screenItems = string;
      }
    );
  }

  public selectedItem(indexItem: number, e: Event): void {
    e.preventDefault();
    this.stockItem = 0;
    this.itemDetails = this.listItemsToDisplay[indexItem];
    this.itemsServices.getStock(this.itemDetails.id).subscribe(
      (stock) => {
        this.stockItem = stock;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.errorMessage = 'erreur technique :\nNous ne pouvons pas déterminer le stock actuel de l\'article selectionné.';
      }
    );
    this.screenItems = 'detailsItem';
  }

  public back(): void {
    this.errorMessage = '';
    this.screenItems = '';
  }

  public movePage(e: PageEvent): void {
    const startIndex = e.pageIndex * e.pageSize;
    const endIndex = Math.min(startIndex + e.pageSize - 1, e.length - 1);
    this.pagingList = this.listItemsToDisplay.slice(startIndex, endIndex + 1);
  }

  public getOptionColors(ref: string): Items[] {
    const reference = ref.split('/');
    return this.listItemsToDisplay.filter(item => item.reference.includes(reference[0]));
  }

  public addCaddy(item: Items, qty: number): void {
    if (qty > this.stockItem) {
      this.errorMessage = 'Désolé il n\'y a pas suffisament de stock pour cet article';
    } else {
      this.errorMessage = '';
      this.caddyServices.updateCaddy(item, qty);
    }
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public getListItemsToDisplay(): Items[] {
    return this.listItemsToDisplay;
  }

  public setListItemsToDisplay(items: Items[]): void {
    this.listItemsToDisplay = items;
  }

  public getErrorMessage(): string {
    return this.errorMessage;
  }

  public getScreenItems(): string {
    return this.screenItems;
  }

  public setScreenItems(s: string): void {
    this.screenItems = s;
  }

  public getItemsDetails(): Items {
    return this.itemDetails;
  }

  public getPagingList(): Items[] {
    return this.pagingList;
  }

  public getStockItem(): number {
    return this.stockItem;
  }

}
