import { HttpErrorResponse } from '@angular/common/http';
import { UsersServicesService } from './../../services/users-services.service';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Countries } from '../../tools/countries.enum';
import { LengthDatas } from '../../tools/length-datas.enum';
import { ValidateCountry, ValidateEmailCompare, ValidatePasswordCompare, ValidateAge } from '../../tools/customvalidators';
import { Users } from '../../models/users';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  errorMessage: string; // attribut to get some error messages
  // attribut to manage the display of page user
  userView: string;
  // attribut to get user informations
  user: Users;
  // list of enumeration Countries
  countries = Countries;
  // attribut to follow if a send action is in progress
  sendAction = false;
  // FormGroup to manage the controls of account opening
  accountOpening = new FormGroup({
    lastName: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_LASTNAME),
      Validators.pattern('[\'a-zA-ZÀ-ÖØ-öø-ÿ -]*')]),
    firstName: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_FIRSTNAME),
      Validators.pattern('[a-zA-ZÀ-ÖØ-öø-ÿ -]*')]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_PHONE),
      Validators.pattern('[a-zA-Z0-9 +-]*')]),
    birthDate: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATE_BIRTHDATE),
      Validators.pattern('[0-9-]*'), ValidateAge]),
    street: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_STREET),
      Validators.pattern('[\'a-zA-ZÀ-ÖØ-öø-ÿ0-9 -]*')]),
    zipCode: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_ZIPCODE),
      Validators.pattern('[a-zA-Z0-9 -]*')]),
    city: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_CITY),
      Validators.pattern('[\'a-zA-ZÀ-ÖØ-öø-ÿ -]*')]),
    country: new FormControl(Countries.FRANCE, [Validators.required, Validators.maxLength(LengthDatas.DATA_COUNTRY), ValidateCountry]),
    mail: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(LengthDatas.DATA_MAIL)],
    this.EmailAlreadyUsed.bind(this)),
    mail2: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(LengthDatas.DATA_MAIL)]),
    pwd: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_PWD), Validators.pattern('[^"\'=!><: ]*')]),
    pwd2: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_PWD), Validators.pattern('[^"\'=!><: ]*')]),
    agree: new FormControl('', Validators.requiredTrue)
  },
  {
    validators: [ValidateEmailCompare, ValidatePasswordCompare]
  });

  constructor(private location: Location, private usersServices: UsersServicesService, private dialog: MatDialog) { }

  ngOnInit() {
    this.usersServices.getConnexion().subscribe((result) => {
      if (result === true) {
        this.userView = 'userAccount';
        this.user = this.usersServices.getUser();
        console.log('TOTO');
      }
    });
  }

  // method to check that email is already used
  EmailAlreadyUsed(control: FormControl): Promise<{}> {
    const result = new Promise((resolve, reject) => {
      this.usersServices.checkMail(control.value).subscribe(
        (value) => {
          if (value === true) {resolve({ 'availableMail': true }); } else {resolve(null); }
        },
        (error: HttpErrorResponse) => {console.log(error); console.log('erreur recherche'); reject(null); }
      );
    });
    return result;
  }

  // method to open an account
  openAccount(values): void {
    this.sendAction = true;
    const tempUser = new Users();
    tempUser.lastName = values.lastName.toUpperCase();
    tempUser.firstName = values.firstName.charAt(0).toUpperCase() + values.firstName.substring(1).toLowerCase();
    tempUser.dateOfBirth = new Date(values.birthDate);
    tempUser.mail = values.mail.toLowerCase();
    tempUser.password = values.pwd;
    tempUser.phone = values.phone;
    tempUser.street = values.street;
    tempUser.zipCode = values.zipCode;
    tempUser.city = values.city.toUpperCase();
    tempUser.country = values.country;
    tempUser.dateOfCreation = new Date();
    this.usersServices.openAccount(tempUser).subscribe(
      (result) => {
        if (result) {
          const dialogRef = this.dialog.open(DialogComponent, {data : {view: 'inscriptionIsDone'}});
          this.sendAction = false;
          dialogRef.afterClosed().subscribe((back) => {
            if (back === 'OK') {
              this.location.back();
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        this.sendAction = false;
        if (error.status === 400) {
          this.errorMessage = 'Désolé, votre demande n\'a pas pu être traitée.\nMerci de la renouveller ultérieurement.';
        } else {
          this.errorMessage = 'Erreur technique:\nLa demande n\'a pas aboutie. Merci de la renouveller ultérieurement.';
        }
      }
    );
  }

  // method to go back
  goBack(): void {
    this.location.back();
  }

}
