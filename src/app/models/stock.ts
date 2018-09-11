import { Items } from './items';

export class Stock {
  public quantity?: number;
  public item?: Items;

  constructor(quantity?: number, item?: Items) {
    this.quantity = quantity;
    this.item = item;
  }
}
