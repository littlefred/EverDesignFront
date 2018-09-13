import { CaddyServicesService } from './../../services/caddy-services.service';
import { Items } from './../../models/items';
import { ItemsServicesService } from './../../services/items-services.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Images } from '../../models/images';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  // formControl to manage the disable action in select option
  disableSelect = new FormControl(false);
  // to manage error messages
  errorMessage: string;
  // attribut to save the list of items selection
  listItemsToDisplay: Items[];
  // attribut to manage the type of display of item(s)
  screenItems: string;
  // attribut to save the item to display details
  itemDetails: Items;
  // main picture choice to display in details view
  image: string;
  // number of picture by album page
  readonly ALBUM_SIZE = 3;
  // list of item to display on function of page in list view
  pagingList: Items[];
  // list of pictures to display on function of page in details view
  pagingAlbum: Images[];
  // page number of item album
  numberPage = 0;
  // attribut to get the stock of an item
  stockItem: number;

  constructor(private itemsServices: ItemsServicesService, private caddyServices: CaddyServicesService, private dialog: MatDialog) {
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
    this.itemsServices.getSeeItem().subscribe(
      (item) => {
        this.itemDetails = item;
        if (this.itemDetails.listImagesOfItem !== undefined) {
          this.pagingAlbum = this.itemDetails.listImagesOfItem.slice(0,
            Math.min(this.ALBUM_SIZE, this.itemDetails.listImagesOfItem.length));
        }
      }
    );
  }

          ngOnInit() {
          }

          // method to save the item selected, change view of component and check the stock about it
          public selectedItem(indexItem: number, e: Event): void {
            e.preventDefault();
            this.stockItem = 0;
            this.image = '';
            this.itemDetails = this.listItemsToDisplay[indexItem];
            console.log(this.itemDetails);
            this.pagingAlbum = this.itemDetails.listImagesOfItem.slice(0,
              Math.min(this.ALBUM_SIZE, this.itemDetails.listImagesOfItem.length));
              this.numberPage = 0;
              this.itemsServices.getStock(this.itemDetails.id).subscribe(
                (stock) => {
                  this.stockItem = stock;
                },
                (error: HttpErrorResponse) => {
                  console.log(error);
                  this.errorMessage = 'erreur technique : Nous ne pouvons pas déterminer le stock actuel de l\'article selectionné.';
                }
                );
                this.screenItems = 'detailsItem';
              }

              // method to return to the list display
              public back(): void {
                this.errorMessage = '';
                this.screenItems = '';
              }

              // method to manage the paginator in list view
              public movePage(e: PageEvent): void {
                const startIndex = e.pageIndex * e.pageSize;
                const endIndex = Math.min(startIndex + e.pageSize - 1, e.length - 1);
                this.pagingList = this.listItemsToDisplay.slice(startIndex, endIndex + 1);
              }

              // method to check if another colors exists for an item
              public getOptionColors(ref: string): Items[] {
                const reference = ref.split('/');
                const listChoice = this.listItemsToDisplay.filter(item => item.reference.includes(reference[0]));
                listChoice.splice(listChoice.indexOf(this.itemDetails), 1);
                return listChoice;
              }

              // method to add item at the caddy
              public addCaddy(item: Items, qty: number): void {
                if (qty > this.stockItem) {
                  this.errorMessage = 'Désolé il n\'y a pas suffisament de stock pour cet article';
                } else {
                  this.errorMessage = '';
                  this.caddyServices.updateCaddy(item, qty);
                }
              }

              // method to choice a same item withanother color
              public changeColor(item: Items): void {
                this.itemDetails = item;
              }

              // method to display main picture of item in details view
              public getImage(): string {
                return this.image;
              }

              // method to select a picture to display as main picture
              public setImage(name: string): void {
                console.log(name);
                this.image = name;
              }

              // method to select next page of album
              public nextPic(pageIndex: number): void {
                this.numberPage = pageIndex;
                const startIndex = pageIndex * this.ALBUM_SIZE;
                const endIndex = Math.min(startIndex + this.ALBUM_SIZE - 1, this.itemDetails.listImagesOfItem.length - 1);
                this.pagingAlbum = this.itemDetails.listImagesOfItem.slice(startIndex, endIndex + 1);
              }

              // method to calcul the maximum page of item album
              public maxPage(): number {
                if (this.itemDetails.listImagesOfItem.length % this.ALBUM_SIZE === 0) {
                  return (this.itemDetails.listImagesOfItem.length / this.ALBUM_SIZE) - 1;
                } else {
                  return Math.floor(this.itemDetails.listImagesOfItem.length / this.ALBUM_SIZE);
                }
              }

              // method to open the diaporama on details view
              public openDialog(): void {
                let mainPic = this.itemDetails.listImagesOfItem.find(e => e.image === this.image);
                if (!mainPic) {mainPic = this.itemDetails.listImagesOfItem[0]; }
                this.dialog.open(DialogComponent, {
                  // width: '250px',
                  data: {
                    album: this.itemDetails.listImagesOfItem,
                    mainPic: this.itemDetails.listImagesOfItem.indexOf(mainPic),
                    view: 'diapo'
                  }
                });
              }

            }
