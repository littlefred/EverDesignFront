import { Router } from '@angular/router';
import { CaddyServicesService } from './caddy-services.service';
import { Positions } from './../tools/positions.enum';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Users } from '../models/users';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersServicesService {
  // attribut to save the backend address
  private readonly URL_USERS = environment.backEndUrl + '/users';
  // Subject to follow the list of item that user want to buy
  private userConnected = new BehaviorSubject<boolean>(false);
  // attribut to save the state connection of user
  private connectionState = new Subject<boolean>();
  // attribut to manage the user data when is connected
  private user: Users;
  // private user = new BehaviorSubject<Users>(new Users());

  constructor(private http: HttpClient, private caddyServices: CaddyServicesService, private router: Router) {
    this.userConnected.subscribe((value) => {this.connectionState.next(value); });
  }

  // method to ask a new passowrd when user forgot it
  public newPassword(): void {
    console.log('oubli de mot de passe: renvoi');
  }

  // method to try to connect the user
  public authentification(mail: string, pwd: string): void {
    this.http.post(this.URL_USERS + '/cnx', {mail: mail, pwd: pwd}).subscribe(
      (value: Users) => {
        if (value.position !== Positions.USER_NOVALID) {
          this.userConnected.next(true);
          this.user = value;
          this.caddyServices.getOrderInProgressBeforePaid(this.user.id);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.user = new Users();
          this.userConnected.next(false);
        }
      }
    );
  }

  // method to do deconnection of user
  public deconnection(): void {
    this.user = new Users();
    this.userConnected.next(false);
    this.router.navigateByUrl('');
    this.caddyServices.deleteOrderInProgress();
  }

  /**********************
  **********************
  * GETTERS AND SETTERS
  **********************
  *********************/

  public getConnexion(): Observable<boolean> {
    return this.userConnected;
  }

  public getStateConnexion(): Observable<boolean> {
    return this.connectionState;
  }

  public getUser(): Users {
    return this.user;
  }
}
