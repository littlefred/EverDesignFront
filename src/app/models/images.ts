import { Items } from './items';

export class Images {
  public id?: number;
  public image?: string;
  public item?: Items;

  constructor(id?: number, image?: string, item?: Items) {
    this.id = id;
    this.image = image;
    this.item = item;
  }
}
