import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { AsYouType, CountryCode } from 'libphonenumber-js';
@Directive({
  selector: '[appPrettifyPhone]',
})
export class PrettifyPhoneDirective implements AfterViewInit {
  @Input('appPrettifyPhone')
  countryCode: string;

  constructor(private elem: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    let asYouType: AsYouType = new AsYouType(
      this.countryCode.toUpperCase() as CountryCode
    );
    const phone = this.elem.nativeElement.innerHTML;

    if (asYouType) {
      let newVal = phone.replace(/\D/g, '');

      newVal = asYouType.input(newVal);
      this.renderer.setProperty(this.elem.nativeElement, 'innerText', newVal);
    }
  }
}
