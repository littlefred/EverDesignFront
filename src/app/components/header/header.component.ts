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
  // creation of the form control to do the search with autocompletion
  searchItems = new FormControl;
  // creation of an observable for the form control
  private filteredItems: Observable<Items[]>;
  // creation of the filtered list of items
  private filteredList = new Array<Items>();
  // list of all items
  private allItems: Items[];

  constructor(private router: Router, private itemsServices: ItemsServicesService) {
    this.allItems = this.itemsServices.getGlobalItemsList();
  }

  ngOnInit() {
    // loading of method to search items with autocompletion
    this.filteredItems = this.searchItems.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSearch(value))
    );
    this.filteredItems.subscribe(
      (list) => {this.filteredList = list; }
    );
  }

  // creation of the filter of the autocompletion search
  private filterSearch(value: string): Items[] {
    console.log(value);
    if (value) {this.router.navigateByUrl('/items'); } else {this.router.navigateByUrl(''); }
    const filtervalue = value.toLowerCase();
    return this.allItems.filter(item => item.name.toLowerCase().includes(filtervalue));
  }

  // method to reset the search
  public reset(): void {
this.searchItems.reset();
  }

}
