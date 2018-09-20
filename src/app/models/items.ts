import { Categories } from 'src/app/models/categories';
import { Images } from './images';
import { Colors } from './colors';

export class Items {
  public id?: number;
  public name?: string;
  public reference?: string;
  public category?: Categories;
  public price?: number;
  public discountPrice?: number;
  public informations?: string;
  public description?: string;
  public quantity?: number;
  public listImagesOfItem?: Images[];
  public colors?: Colors[];

  constructor(id?: number, name?: string, reference?: string, category?: Categories,
    price?: number, discountPrice?: number, informations?: string, description?: string,
    quantity?: number, listImagesOfItem?: Images[], colors?: Colors[]) {
    this.id = id;
    this.name = name;
    this.reference = reference;
    this.category = category;
    this.price = price;
    this.discountPrice = discountPrice;
    this.informations = informations;
    this.description = description;
    this.quantity = quantity;
    this.listImagesOfItem = listImagesOfItem;
    this.colors = colors;
  }

}
