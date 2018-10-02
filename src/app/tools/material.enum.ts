export enum Material {
  PVC = 'PVC',
  VERRE = 'VERRE',
  CUIR = 'CUIR',
  TISSU = 'TISSU',
  CHÊNE = 'CHÊNE',
  HÊTRE = 'HÊTRE',
  MERISIER = 'MERISIER',
  PIN = 'PIN',
  ACIER = 'ACIER',
  INOX = 'INOX',
  CUIVRE = 'CUIVRE',
  ETAIN = 'ETAIN',
  COMPOSITE = 'COMPOSITE',
  CONTREPLAQUE = 'CONTREPLAQUE'
}

export namespace Material {
  export function values() {return Object.keys(Material).filter((type) => type !== 'values'); }
}
