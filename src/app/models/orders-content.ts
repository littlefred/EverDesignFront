import { Items } from './items';

export class OrdersContent {
  public item?: Items;
  public qty?: number;

  constructor(item?: Items, qty?: number) {
    this.item = item;
    this.qty = qty;
  }
}
