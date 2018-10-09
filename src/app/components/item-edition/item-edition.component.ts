import { Router } from '@angular/router';
import { ItemsServicesService } from './../../services/items-services.service';
import { Categories } from './../../models/categories';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Material } from './../../tools/material.enum';
import { CategoriesServicesService } from './../../services/categories-services.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Items } from '../../models/items';
import { LengthDatas } from '../../tools/length-datas.enum';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Colors } from '../../models/colors';
import { Images } from '../../models/images';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-edition',
  templateUrl: './item-edition.component.html',
  styleUrls: ['./item-edition.component.scss']
})
export class ItemEditionComponent implements OnInit {
  // attribut to get error message
  errorMessage: string;
  // attribut to get the list of categories
  categoriesList: Categories[];
  // attribut to get category if there was a choice
  categorySelected: Categories;
  // management of material list
  private orderedMaterialList = Material.values().sort((a, b) => a.localeCompare(b)); // attribut to list Material values in alphabetic name
  materialList = this.orderedMaterialList;
  // attribut to get global list of colors
  colorsGlobalList: Colors[];
  // attribut to get selected list since material choice
  selectedList: Colors[][][] = new Array(new Array(new Array()));
  // list to save the selection of pictures
  selectedPics: {key: string, files: File}[][] = new Array(new Array());
  // formData to prepare upload files in request http
  formdata = new FormData();
  // attribut to follow the progression of uploading files & saving items
  progress: { percentage: number } = { percentage: 0 };
  // Form controls for the edition form
  editionForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_ITEM_PRICE), Validators.pattern('[0-9,.]*')]),
    discountPrice: new FormControl('', [Validators.maxLength(LengthDatas.DATA_ITEM_PRICE), Validators.pattern('[0-9,.]*')]),
    name: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_ITEM_NAME),
      Validators.pattern('[\'a-zA-ZÀ-ÖØ-öø-ÿ0-9, -]*')]),
    itemNumber: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_ITEM_NUMBER),
      Validators.pattern('[a-zA-Z0-9]*')]),
    qty: new FormControl('', [Validators.maxLength(4), Validators.pattern('[0-9]*')]),
    composition: new FormArray([new FormGroup({
      colors: new FormArray([new FormControl('', Validators.required)]),
      pics: new FormArray([new FormControl('', Validators.required)])
    })]),
    technicalInformations: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_TECHNICAL_ITEM),
      Validators.pattern('[\\n\'a-zA-ZÀ-ÖØ-öø-ÿ0-9,;. -]*')]),
    description: new FormControl('', [Validators.maxLength(LengthDatas.DATA_DESCRIPTION_ITEM),
      Validators.pattern('[\\n\'a-zA-ZÀ-ÖØ-öø-ÿ0-9,;. -]*')])
  });

  constructor(private categoriesServices: CategoriesServicesService, private dialog: MatDialog,
    private formBuilder: FormBuilder, private itemsServices: ItemsServicesService, private location: Location, private router: Router) {}

  ngOnInit() {
    this.categoriesServices.getCategoriesList().subscribe(
      (result: Categories[]) => {
        this.categoriesList = result;
        if (this.categoriesList !== undefined && this.itemsServices.getCategoryIdSelected() !== 0) {
          this.categorySelected = this.categoriesList.find(c => c.id === this.itemsServices.getCategoryIdSelected());
          this.editionForm.get('category').setValue(this.categorySelected);
        }
      }
    );
    this.categoriesServices.getAllColors().subscribe(
      (result) => {this.colorsGlobalList = result; },
      (error: HttpErrorResponse) => {if (error) {this.errorMessage = 'Erreur technique: pas de matériaux disponible.'; }}
    );
  }

  // method to go back
  callback(): void {
    this.location.back();
  }

  // method to get controls of composition FormArray
  getComposition(): FormArray {
    return this.editionForm.get('composition') as FormArray;
  }

  // method to remove a composition
  removeComposition(i: number, e: Event): void {
    e.preventDefault();
    this.getComposition().removeAt(i);
    this.selectedList.splice(i, 1);
    this.selectedPics.splice(i, 1);
  }

  // method to add a composition
  addComposition(e: Event): void {
    e.preventDefault();
    const newCompo = this.formBuilder.group({
      colors: new FormArray([new FormControl('', Validators.required)]),
      pics: new FormArray([new FormControl('', Validators.required)])
    });
    this.getComposition().push(newCompo);
    this.selectedList.push(new Array());
    this.selectedPics.push(new Array());
  }

  // method to get controls of colors FormArray in composition[i]
  getColors(i: number): FormArray {
    return this.getComposition().controls[i].get('colors') as FormArray;
  }

  // methos to add a FormControl for colors in editionForm
  addColors(i: number, e: Event): void {
    e.preventDefault();
    const newColorsControl = this.formBuilder.control('', Validators.required);
    this.getColors(i).push(newColorsControl);
    this.selectedList[i].push(new Array());
  }

  // method to remove a FormControl for colors in editionForm
  removeColor(i: number, j: number, e: Event): void {
    e.preventDefault();
    this.getColors(i).removeAt(j);
    this.selectedList[i].splice(j, 1);
  }

  // method to generate the select list filtered
  selectedMaterial(i: number, j: number, event): void {
    const selectedMaterial = event.target.value;
    if (this.selectedList[i][j]) {
      this.selectedList[i][j] = this.colorsGlobalList.filter(c => c.material === selectedMaterial);
    } else {
      this.selectedList[i].push(this.colorsGlobalList.filter(c => c.material === selectedMaterial));
    }
  }

  // method to get controls of pics FormArray in composition[i]
  getPics(i: number): FormArray {
    return this.getComposition().controls[i].get('pics') as FormArray;
  }

  // method to add a FormControl for pics in editionForm
  addPics(i: number, e: Event): void {
    e.preventDefault();
    const newPicsControl = this.formBuilder.control('', Validators.required);
    this.getPics(i).push(newPicsControl);
  }

  // method to remove a FormControl for pics in editionForm
  removePics(i: number, k: number, e: Event): void {
    e.preventDefault();
    this.getPics(i).removeAt(k);
    this.selectedPics[i].splice(k, 1);
  }

  // method to update the selectedPics list when a file has been selected in input
  selectPic(event, i: number, k: number): void {
    let check = true;
    if (event.target.files[0].size > 2000000) {
      this.getPics(i).controls[k].setErrors({sizeControl: true});
      check = false;
    }
    if (check && event.target.files[0].type !== 'image/png' && event.target.files[0].type !== 'image/jpg'
    && event.target.files[0].type !== 'image/jpeg') {
      this.getPics(i).controls[k].setErrors({formatPic: true});
    }
    if (check) {
      const tempPic = {key: event.target.value, files: event.target.files};
      if (this.selectedPics[i][k]) {
        this.selectedPics[i][k] = tempPic;
      } else {
        this.selectedPics[i].push(tempPic);
      }
    }
  }

  // method to add a category
  addCategory(e: Event): void {
    e.preventDefault();
    this.dialog.open(DialogComponent, {
      data: {
        view: 'addCategory'
      }
    });
  }

  // method to create a new material
  createMaterial(e: Event): void {
    e.preventDefault();
    this.dialog.open(DialogComponent, {
      data: {
        view: 'createMaterial'
      }
    });
  }

  // method to save a item in DB
  saveItem(values): void {
    const items: Items[] = new Array();
    let c = 0;
    this.getComposition().controls.forEach(compo => {
      const tempItem: Items = new Items();
      tempItem.category = values.category;
      tempItem.name = values.name.charAt(0).toUpperCase() + values.name.substring(1).toLowerCase();
      tempItem.price = values.price.toFixed(2) * 100;
      if (values.discountPrice !== '') {
        tempItem.discountPrice = values.discountPrice.toFixed(2) * 100;
      } else {tempItem.discountPrice = 0; }
      if (values.qty !== '') {tempItem.quantity = values.qty; } else {tempItem.quantity = 0; }
      tempItem.informations = values.technicalInformations;
      tempItem.description = values.description;
      let colorsIdentity = '';
      tempItem.colors = new Array();
      compo.get('colors').value.forEach(cl => {
        tempItem.colors.push(cl);
        colorsIdentity += cl.id + '.';
      });
      const colorNumber = ' / CL.' + colorsIdentity;
      tempItem.reference = values.itemNumber.toUpperCase() + colorNumber;
      let i = 0;
      tempItem.listImagesOfItem = new Array();
      compo.get('pics').value.forEach(p => {
        const uploadDate = new Date();
        let picName: string = c.toString() + uploadDate.getUTCFullYear().toString() + uploadDate.getUTCMonth().toString()
        + uploadDate.getUTCDay().toString() + uploadDate.getUTCHours().toString() + uploadDate.getUTCMinutes().toString()
        + uploadDate.getUTCSeconds().toString() + uploadDate.getUTCMilliseconds().toString()
        + values.itemNumber.toUpperCase() + i.toString();
        i++;
        let tempPic: {key: string, files: File};
        this.selectedPics.forEach(line => line.forEach(e => {if (e.key === p) {tempPic = e; }}));
        const file = tempPic.files[0];
        const extension = file.type.split('/');
        picName += '.' + extension[extension.length - 1];
        const image: Images = new Images();
        image.image = picName;
        tempItem.listImagesOfItem.push(image);
        tempPic.key = picName;
        this.formdata.append('files', file, picName);
      });
      items.push(tempItem);
      c++;
    });
    this.itemsServices.sendPics(this.formdata).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        const tempResult = Object.entries(event.body);
        items.forEach(item => {
          item.listImagesOfItem.forEach(image => {
            tempResult.forEach(e => {
              if (e[0] === image.image && e[1] === false) {item.listImagesOfItem.splice(item.listImagesOfItem.indexOf(image), 1); }
            });
          });
          if (item.listImagesOfItem.length <= 0) {items.splice(items.indexOf(item), 1); }
        });
        this.itemsServices.sendItems(items).subscribe(event2 => {
          if (event2.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(100 * event2.loaded / event2.total);
          } else if (event2 instanceof HttpResponse) {
            console.log('item(s) is/are saved');
            this.location.back();
          }
        });
      }
    });
  }

}
