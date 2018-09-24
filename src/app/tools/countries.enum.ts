export enum Countries {
  FRANCE = 'FRANCE',
  QUEBEC = 'QUEBEC',
  GUYANE_FRANCAISE = 'GUYANE FRANCAISE',
  BELGIQUE = 'BELGIQUE',
  LUXEMBOURG = 'LUXEMBOURG',
  SUISSE = 'SUISSE'
}

export namespace Countries {
  export function values() {return Object.keys(Countries).filter((type) => type !== 'values'); }
}
