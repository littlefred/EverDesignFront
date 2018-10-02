import { Material } from './material.enum';
import { LengthDatas } from './length-datas.enum';
import { Countries } from './countries.enum';
import { AbstractControl } from '@angular/forms';

export function ValidateCountry(control: AbstractControl) {
  if (!Countries.values().includes(control.value)) {
    return { validCountry: true};
  } else {
    return null;
  }
}

export function ValidateMaterial(control: AbstractControl) {
  if (!Material.values().includes(control.value)) {
    return { validMaterial: true};
  } else {
    return null;
  }
}

export function ValidateEmailCompare(control: AbstractControl) {
  const mail1 = control.get('mail').value;
  const mail2 = control.get('mail2').value;
  if (mail1 !== mail2) {
    return {emailCompare: true};
  } else {
    return null;
  }
}

export function ValidatePasswordCompare(control: AbstractControl) {
  const pwd1 = control.get('pwd').value;
  const pwd2 = control.get('pwd2').value;
  if (pwd1 !== pwd2) {
    return {pwdCompare: true};
  } else {
    return null;
  }
}

export function ValidateAge(control: AbstractControl) {
  const date1 = new Date(control.value);
  const date2 = new Date();
  date1.setFullYear(date1.getFullYear() + LengthDatas.LEGAL_MAJORITY);
  if (!(date1 <= date2)) {
    return {majorityControl: true};
  } else {
    return null;
  }
}
