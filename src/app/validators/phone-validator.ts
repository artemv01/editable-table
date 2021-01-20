import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import parseMin, {
  CountryCode,
  getCountryCallingCode,
} from 'libphonenumber-js';

export function validatePhone(countryCode: string): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    const error = { invalidPhone: control.value };
    if (!control.value || !control.value.length) {
      return error;
    }
    const code = getCountryCallingCode(countryCode as CountryCode);
    const number = `+${code} ${control.value}`;

    const parsed = parseMin(number);

    if (!parsed || !parsed.isValid()) {
      return error;
    }

    return null;
  };
}
