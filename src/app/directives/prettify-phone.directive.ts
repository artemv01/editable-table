import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { AsYouType, CountryCode } from 'libphonenumber-js';
@Directive({
  selector: '[appPrettifyPhone]',
})
export class PrettifyPhoneDirective implements AfterViewInit {
  @Input('appPrettifyPhone')
  countryCode: string;

  constructor(private elem: ElementRef) {}

  ngAfterViewInit() {
    let asYouType: AsYouType = new AsYouType(
      this.countryCode.toUpperCase() as CountryCode
    );
    const phone = this.elem.nativeElement.innerHTML;

    if (asYouType) {
      let newVal = phone.replace(/\D/g, '');

      newVal = asYouType.input(newVal);
      this.elem.nativeElement.innerText = newVal;
    }
  }
}
