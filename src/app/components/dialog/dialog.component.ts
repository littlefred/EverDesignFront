import { LengthDatas } from './../../tools/length-datas.enum';
import { UsersServicesService } from './../../services/users-services.service';
import { CaddyComponent } from './../caddy/caddy.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  errorlogin: string; // attribut to note the error message for a connexion
  // method to control login formulaire
  cnxControl = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(LengthDatas.DATA_MAIL)]),
    pwd: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_PWD), Validators.pattern('[^"\'= ]*')])
  });

  constructor(public dialogRef: MatDialogRef<CaddyComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private usersServices: UsersServicesService) {}

  ngOnInit() {
  }

  // method to reload password since view dialogue connexion
  public askPassword(): void {
    this.usersServices.newPassword();
    this.dialogRef.close();
  }

  // method to do connexion
  public userCnx(mail: string, pwd: string): void {
    this.usersServices.authentification(mail, pwd);
    this.usersServices.getStateConnexion().subscribe(
      (value) => {
        if (value) {
          this.errorlogin = '';
          this.dialogRef.close('cnxOK');
        } else {
          this.errorlogin = 'Connexion échouée';
        }
      }
    );
  }

  // method call to close the dialogue
  public close(): void {
    this.dialogRef.close();
  }

}
