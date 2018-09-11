import { Countries } from '../tools/countries.enum';
import { Positions } from '../tools/positions.enum';

export class Users {
  public id?: number;
  public firstName?: string;
  public lastName?: string;
  public dateOfBirth?: Date;
  public mail?: string;
  public password?: string;
  public phone?: number;
  public street?: string;
  public city?: string;
  public zipCode?: string;
  public country?: Countries;
  public position?: Positions;

  constructor(id?: number, firstName?: string, lastName?: string, dateOfBirth?: Date,
    mail?: string, password?: string, phone?: number, street?: string, city?: string, zipCode?: string,
    country?: Countries, position?: Positions) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.dateOfBirth = dateOfBirth;
      this.mail = mail;
      this.password = password;
      this.phone = phone;
      this.street = street;
      this.city = city;
      this.zipCode = zipCode;
      this.country = country;
      this.position = position;
    }
  }
