import { Material } from '../tools/material.enum';

export class Colors {
  public id?: number;
  public material?: Material;
  public name?: string;
  public sticker?: string;

  constructor(id?: number, material?: Material, name?: string, sticker?: string) {
    this.id = id;
    this.material = material;
    this.name = name;
    this.sticker = sticker;
  }
}
