import { Countries } from './countries.enum';
import { AbstractControl } from '@angular/forms';

export function ValidateCountry(control: AbstractControl) {
  if (!Countries.values().includes(control.value)) {
    return { validCountry: true };
  }
  return null;
}
