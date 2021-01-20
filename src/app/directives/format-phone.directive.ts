import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AsYouType, CountryCode } from 'libphonenumber-js';
@Directive({
  selector: '[appPhoneMask]',
})
export class FormatPhoneDirective {
  @Input('appPhoneMask')
  countryCode: string;

  constructor(public ngControl: NgControl) {}

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {
    let asYouType: AsYouType = new AsYouType(
      this.countryCode.toUpperCase() as CountryCode
    );

    if (asYouType) {
      let newVal = event.replace(/\D/g, '');

      if (backspace && newVal.length <= 6) {
        newVal = newVal.substring(0, newVal.length - 1);
      }

      newVal = asYouType.input(newVal);

      this.ngControl.valueAccessor.writeValue(newVal);
    }
  }
}
