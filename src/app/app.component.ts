import { AfterViewInit, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddUserComponent } from './add-user/add-user.component';
import { COUNTRIES } from './countries';
import { User } from './models/user';
import { USERS } from './users';
import { validatePhone } from './validators/phone-validator';

type EditType = 'email' | 'name' | 'phone';
type EditConfig = Record<string, EditType[]>;
type EditControls = Record<string, Record<string, FormControl>>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'editable-table';
  displayedColumns = ['name', 'email', 'phone', 'actions'];
  users: Record<string, User> = USERS;
  _users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    Object.values(this.users)
  );
  users$: Observable<User[]> = this._users$.asObservable();

  editSwitchers: EditConfig = {};
  editControls: EditControls = {};

  countries = Object.values(COUNTRIES);

  constructor(public dialog: MatDialog) {}
  ngAfterViewInit() {}

  getControl(id: string, editType: EditType) {
    const validators = {
      name: [Validators.required],
      email: [Validators.required, Validators.email],
      phone: [Validators.required],
    };
    if (editType === 'phone') {
      validators.phone.push(validatePhone(this.users[id].countryCode));
    }
    if (!this.editControls[`${id}`]) {
      this.editControls[`${id}`] = {};
      this.editControls[`${id}`][editType] = new FormControl(
        this.users[id][editType],
        validators[editType] ?? []
      );
      return this.editControls[`${id}`][editType];
    }
    if (this.editControls[`${id}`] && this.editControls[`${id}`][editType]) {
      return this.editControls[`${id}`][editType];
    }
    this.editControls[`${id}`][editType] = new FormControl(
      this.users[id][editType],
      validators[editType]
    );
    return this.editControls[`${id}`][editType];
  }
  getCallingPrefix(country: string) {
    return '+' + getCountryCallingCode(country as CountryCode);
  }

  isEditMode(id: string, editType: EditType) {
    if (
      Array.isArray(this.editSwitchers[id]) &&
      this.editSwitchers[id].includes(editType)
    ) {
      return true;
    }
    return false;
  }

  isEditModeDisabled(id: string) {
    const controls = this.editControls[id];
    for (const [, value] of Object.entries(controls)) {
      if (value.invalid) {
        return true;
      }
    }
  }

  isRowInEditMode(id: string) {
    return (
      Array.isArray(this.editSwitchers[id]) && this.editSwitchers[id].length
    );
  }

  createUser(user: User) {
    this.users[user.id] = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      countryCode: user.countryCode,
    };
    this._users$.next(Object.values(this.users));
  }

  onAddUserClick() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createUser(result);
      }
    });
  }

  onColClick(id: string, editType: EditType) {
    const editList = this.editSwitchers[id];
    if (!editList) {
      this.editSwitchers[id] = [editType];
    } else {
      const idx = editList.findIndex((val) => val === editType);
      if (idx !== -1) {
        editList.splice(idx, 1);
      } else {
        editList.push(editType);
      }
    }
  }

  onCancelEditClick(id: string) {
    delete this.editSwitchers[id];
    delete this.editControls[id];
  }

  onFinishEditClick(id: string) {
    if (this.isEditModeDisabled(id)) {
      return false;
    }
    const user = this.users[id];
    Object.keys(this.editControls[id]).forEach((inputName) => {
      user[inputName] = this.editControls[id][inputName].value;
    });
    delete this.editSwitchers[id];
    delete this.editControls[id];
    this._users$.next(Object.values(this.users));
  }

  onDeleteClick(id: string) {
    delete this.users[id];
    this._users$.next(Object.values(this.users));
  }

  onCountryChangeClick(id: string, control: FormControl) {
    this.users[id].countryCode = control.value;

    this.editControls[id].phone.setValidators([
      Validators.required,
      validatePhone(control.value),
    ]);
    this.editControls[id].phone.updateValueAndValidity();
    this._users$.next(Object.values(this.users));
  }
}
