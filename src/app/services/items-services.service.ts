import { Injectable } from '@angular/core';
import { Items } from '../models/items';

@Injectable({
  providedIn: 'root'
})
export class ItemsServicesService {
  // attribut to save the choice of category
  private categoryIdSelected = -1;

  private globalItemsList = new Array<Items>();

  constructor() { }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public setCategoryIdSelected(id: number): void {
    this.categoryIdSelected = id;
  }

  public getCategoryIdSelected(): number {
    return this.categoryIdSelected;
  }

  public getGlobalItemsList(): Items[] {
    return this.globalItemsList;
  }
}
