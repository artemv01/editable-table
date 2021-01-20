import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { COUNTRIES } from '../countries';
import { getID } from '../helpers/get-id';
import { User } from '../models/user';
import { validatePhone } from '../validators/phone-validator';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserComponent>
  ) {}
  selectedCountry: string = 'RU';
  countries = Object.values(COUNTRIES);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, validatePhone(this.selectedCountry)]],
  });

  get callingPrefix() {
    return '+' + getCountryCallingCode(this.selectedCountry as CountryCode);
  }

  onCancelClick() {
    this.dialogRef.close();
  }
  onSubmit() {
    const userData: User = this.userForm.value;
    const code = getCountryCallingCode(this.selectedCountry as CountryCode);
    const phone = userData.phone;
    userData.phone = phone;
    userData.countryCode = this.selectedCountry;
    userData.id = getID();
    this.dialogRef.close(userData);
  }

  ngOnInit(): void {}
}
