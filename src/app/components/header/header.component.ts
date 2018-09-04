import { ItemsServicesService } from './../../services/items-services.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Items } from '../../models/items';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private errorMessage: string; // to manage error messages
  // creation of the form control to do the search with autocompletion
  searchItems = new FormControl;
  // creation of an observable for the form control
  public filteredItems: Observable<Items[]>;
  // creation of the filtered list of items
  public filteredList = new Array<Items>();

  constructor(private router: Router, private itemsServices: ItemsServicesService) {}

  ngOnInit() {
    this.errorMessage = this.itemsServices.getErrorMessage();
    // loading of method to search items with autocompletion
    this.filteredItems = this.searchItems.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSearch(value))
    );
    this.filteredItems.subscribe(
      (list) => {
        this.itemsServices.setSelectedListItems(list);
      }
    );
  }

  // creation of the filter of the autocompletion search
  private filterSearch(value: string): Items[] {
    console.log(value);
    if (value) {this.router.navigateByUrl('/items'); } else {this.router.navigateByUrl(''); }
    let filtervalue = '';
    if (value) {filtervalue = value.toLowerCase(); }
    return this.itemsServices.getInitialGlobalListItems().filter(
      item => item.name.toLowerCase().includes(filtervalue)
    );
  }

  // method to reset the search
  public reset(): void {
    this.searchItems.reset();
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public setErrorMessage(message: string): void {
    this.errorMessage = message;
  }

  public getErrorMessage(): string {
    return this.errorMessage;
  }

}
