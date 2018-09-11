import { Positions } from './../tools/positions.enum';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UsersServicesService {
  // Subject to follow the list of item that user want to buy
  private userConnected = new BehaviorSubject<boolean>(true);
  // attribut to manage the user data when is connected
  private user = new BehaviorSubject<Users>(new Users());

  constructor() { }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public getConnexion(): Observable<boolean> {
    return this.userConnected;
  }

  public setConnexion(value: boolean): void {
    this.userConnected.next(value);
  }

  public getPositions(): Positions {
    return this.user.getValue().position;
  }
}
