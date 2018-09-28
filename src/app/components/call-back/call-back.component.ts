import { HttpErrorResponse } from '@angular/common/http';
import { UsersServicesService } from './../../services/users-services.service';
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrls: ['./call-back.component.scss']
})
export class CallBackComponent implements OnInit, Resolve<string> {
  userId: number; // attribut to get user ID
  login: string; // attribut to get user mail
  callBack: string; // attribut to get type of callback
  callBackState: string; // attribut to get the state of callback response
  errorMessage: string; // attribut to get errorMessage

  constructor(private route: ActivatedRoute, private router: Router, private userServices: UsersServicesService) {}

  ngOnInit() {
    const sourceUrl: ActivatedRouteSnapshot = this.route.snapshot;
    this.userId = +sourceUrl.queryParamMap.get('ID');
    this.login = sourceUrl.queryParamMap.get('login');
    this.callBack = sourceUrl.queryParamMap.get('callBack');
    if (this.callBack === 'confirmAccount') {this.confirmCallBack(); }
  }

  // method Resolve that was implemented to manage the routeur link whitout good informations
  resolve(tempUrl: ActivatedRouteSnapshot): string {
    if (tempUrl.queryParamMap.get('callBack') === 'confirmAccount') {
      return 'account';
    } else {
      this.router.navigate(['']);
      return null;
    }
  }

  // method to do the confirm account callback
  private confirmCallBack(): void {
    if (this.login && this.userId) {
      this.userServices.checkCallBack(this.userId, this.login).subscribe(
        (result) => {
          if (result === 2) {
            this.confirmOK();
          } else {
            this.confirmKO();
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.errorMessage = 'Erreur technique: \nNous ne pouvons pas traiter votre demande actuellement.'
          + '\nMerci de renouveller l\'opération ultérieurement';
        }
      );
    } else {
      this.confirmKO();
    }
  }

  // method to display result when confirm account is too last or done by bad request
  private confirmKO(): void {
    this.callBackState = 'accountConfirmKO';
  }

  // method to display result when confirm account is too last or done by bad request
  private confirmOK(): void {
    this.callBackState = 'accountConfirmOK';
  }

}
