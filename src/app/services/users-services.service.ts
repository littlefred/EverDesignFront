import { Router, Resolve } from '@angular/router';
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
export class UsersServicesService implements Resolve<boolean> {
  // attribut to save the backend address
  private readonly URL_USERS = environment.backEndUrl + '/users';
  // BehaviorSubject to follow the connection of user
  private userConnected = new BehaviorSubject<boolean>(false);
  // attribut to save the state connection of user
  private connectionState = new Subject<boolean>();
  // attribut to manage the user data when is connected
  private user: Users;

  constructor(private http: HttpClient, private caddyServices: CaddyServicesService, private router: Router) {
    this.userConnected.subscribe((value) => {this.connectionState.next(value); });
  }

  // method Resolve that was implemented to manage the routeur link whitout good informations
  resolve(): boolean {
    if (this.userConnected.getValue() === true && (this.user.position === 'USER_ADMIN' || this.user.position === 'USER_ADMIN2')) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }

  // method to ask a new passowrd when user forgot it
  public newPassword(): void {
    console.log('oubli de mot de passe: renvoi');
  }

  // method to check that email is already used
  public checkMail(email: string): Observable<any> {
    return this.http.get(this.URL_USERS, {params: {mail: email}});
  }

  // method to try to connect the user
  public authentification(mail: string, pwd: string): void {
    this.http.post(this.URL_USERS + '/cnx', {mail: mail, pwd: pwd}).subscribe(
      (value: Users) => {
        if (value.position !== Positions.USER_NOVALID) {
          this.userConnected.next(true);
          this.user = value;
          this.caddyServices.getOrderInProgressBeforePaid(this.user.id);
        } else {
          this.userConnected.next(false);
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

  // method to open an account
  public openAccount(user: Users): Observable<Users> {
    return this.http.post(this.URL_USERS, user, {reportProgress: true});
  }

  // method to do deconnection of user
  public deconnection(): void {
    this.user = new Users();
    this.userConnected.next(false);
    this.router.navigateByUrl('');
    this.caddyServices.cleanOrderInProgress();
  }

  // method to check the callback mail conformity
  public checkCallBack(userId: number, userMail: string): Observable<any> {
    return this.http.get(this.URL_USERS + '/callBack', {params: {userId: userId.toFixed(), userMail: userMail}});
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
