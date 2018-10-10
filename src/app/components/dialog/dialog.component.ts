import { ItemsServicesService } from './../../services/items-services.service';
import { CategoriesServicesService } from './../../services/categories-services.service';
import { LengthDatas } from './../../tools/length-datas.enum';
import { UsersServicesService } from './../../services/users-services.service';
import { CaddyComponent } from './../caddy/caddy.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment.prod';
import { Categories } from 'src/app/models/categories';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Material } from 'src/app/tools/material.enum';
import { Colors } from 'src/app/models/colors';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  pathPics = environment.srcUrlItemsPics; // path to get pictures of items
  errorlogin: string; // attribut to note the error message for a connexion
  // method to control login formulaire
  cnxControl = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(LengthDatas.DATA_MAIL)]),
    pwd: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_PWD), Validators.pattern('[^"\'=!: ]*')])
  });
  // attribut to follow if a send action is in progress
  sendAction = false;
  // attribut to get the file selected
  selectedPic: File;
  // attribut FormData to do the send of formulaire datas
  formdata = new FormData();
  // control form to add a category
  editionCat = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_CAT_NAME),
      Validators.pattern('[\'a-zA-ZÀ-ÖØ-öø-ÿ0-9, -]*')]),
    pic: new FormControl('', Validators.required)
  });
  // management of material list
  private orderedMaterialList = Material.values().sort((a, b) => a.localeCompare(b)); // attribut to list Material values in alphabetic name
  materialList = this.orderedMaterialList;
  // control form to add a material
  editionMat = new FormGroup({
    material: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_CAT_NAME),
      Validators.pattern('[\'a-zA-ZÀ-ÖØ-öø-ÿ, -]*')]),
    pic: new FormControl('', Validators.required)
  });

  constructor(public dialogRef: MatDialogRef<CaddyComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private usersServices: UsersServicesService, private categoriesServices: CategoriesServicesService,
  private itemsServices: ItemsServicesService) {}

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

  // method call to close the dialogue after inscription confirm message
  public inscriptionConfirmClose(): void {
    this.dialogRef.close('OK');
  }

  // method call to close the dialogue normally
  public close(): void {
    this.dialogRef.close();
  }

  // method called when pic is selected
  selectPic(event, typeOfForm: string): void {
    let form: FormGroup;
    if (typeOfForm === 'editionCat') {
      form = this.editionCat;
    }
    if (typeOfForm === 'editionMat') {
      form = this.editionMat;
    }
    let check = true;
    if (event.target.files[0].size > 2000000) {
      form.get('pic').setErrors({sizeControl: true});
      check = false;
    }
    if (check && event.target.files[0].type !== 'image/png' && event.target.files[0].type !== 'image/jpg'
    && event.target.files[0].type !== 'image/jpeg') {
      form.get('pic').setErrors({formatPic: true});
    }
    if (check) {
      this.selectedPic = event.target.files[0];
    }
  }

  // method to save a new category
  sendCat(values): void {
    this.sendAction = true;
    const tempName: string = values.name;
    let name = '';
    const formatName: string[] = tempName.split(' ');
    formatName.forEach(word => {
      word = word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
      if (name !== '') {name += ' '; }
      name += word;
    });
    const uploadDate = new Date();
    let picName: string = uploadDate.getUTCFullYear().toString() + uploadDate.getUTCMonth().toString() + uploadDate.getUTCDay().toString()
    + uploadDate.getUTCHours().toString() + uploadDate.getUTCMinutes().toString() + uploadDate.getUTCSeconds().toString()
    + uploadDate.getUTCMilliseconds().toString();
    const extension = this.selectedPic.type.split('/');
    picName += '.' + extension[extension.length - 1];
    const catToSaved = new Categories();
    catToSaved.name = name;
    catToSaved.image = picName;
    this.formdata.append('files', this.selectedPic, picName);
    this.categoriesServices.sendPic(this.formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        const tempResult = event.body;
        if (tempResult === false) {
          this.dialogRef.close('erreurSvg');
        } else {
          this.categoriesServices.sendCategory(catToSaved).subscribe(event2 => {
            if (event2 instanceof HttpResponse) {
              const newCat: Categories = event2.body;
              if (newCat.id !== undefined) {
                console.log('category is saved');
                this.sendAction = false;
                this.categoriesServices.getAllCategories().subscribe((result) => {this.categoriesServices.setCategoriesList(result); });
                this.dialogRef.close('okSvg');
              } else {
                this.dialogRef.close('erreurSvg');
              }
            }
          });
        }
      }
    });
  }

  // method to save a new material
  sendMaterial(values): void {
    this.sendAction = true;
    const name = values.name.toLowerCase();
    const uploadDate = new Date();
    let picName: string = uploadDate.getUTCFullYear().toString() + uploadDate.getUTCMonth().toString() + uploadDate.getUTCDay().toString()
    + uploadDate.getUTCHours().toString() + uploadDate.getUTCMinutes().toString() + uploadDate.getUTCSeconds().toString()
    + uploadDate.getUTCMilliseconds().toString();
    const extension = this.selectedPic.type.split('/');
    picName += '.' + extension[extension.length - 1];
    const materialToSave: Colors = new Colors();
    materialToSave.name = name;
    materialToSave.sticker = picName;
    const material: Material = values.material;
    materialToSave.material = material;
    this.formdata.append('files', this.selectedPic, picName);
    this.itemsServices.sendPic(this.formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        const tempResult = event.body;
        if (tempResult === false) {
          this.dialogRef.close('erreurSvg');
        } else {
          this.itemsServices.sendMaterial(materialToSave).subscribe(event2 => {
            if (event2 instanceof HttpResponse) {
              const newMaterial: Colors = event2.body;
              if (newMaterial.id !== undefined) {
                console.log('material is saved');
                this.sendAction = false;
                this.dialogRef.close('okSvg');
              } else {
                this.dialogRef.close('erreurSvg');
              }
            }
          });
        }
      }
    });
  }

}
