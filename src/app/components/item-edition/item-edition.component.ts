import { Categories } from './../../models/categories';
import { HttpErrorResponse } from '@angular/common/http';
import { Material } from './../../tools/material.enum';
import { CategoriesServicesService } from './../../services/categories-services.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Items } from '../../models/items';
import { LengthDatas } from '../../tools/length-datas.enum';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { ValidateMaterial } from '../../tools/customvalidators';
import { Colors } from '../../models/colors';

@Component({
  selector: 'app-item-edition',
  templateUrl: './item-edition.component.html',
  styleUrls: ['./item-edition.component.scss']
})
export class ItemEditionComponent implements OnInit {
  // attribut to get error message
  errorMessage: string;
  // management of material list
  private orderedMaterialList = Material.values().sort((a, b) => a.localeCompare(b)); // attribut to list Material values in alphabetic name
  materialList = this.orderedMaterialList;
  // attribut to get global list of colors
  colorsGlobalList: Colors[];
  // attribut to get selected list since material choice
  selectedList: Colors[][] = new Array<Colors[]>();
  // attribut to get the list of categories
  categoriesList: Categories[];
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
    colors: new FormArray([new FormControl('', Validators.required)]),
    technicalInformations: new FormControl('', [Validators.required, Validators.maxLength(LengthDatas.DATA_TECHNICAL_ITEM),
      Validators.pattern('[\\n\'a-zA-ZÀ-ÖØ-öø-ÿ0-9,;. -]*')]),
    description: new FormControl('', [Validators.maxLength(LengthDatas.DATA_DESCRIPTION_ITEM),
      Validators.pattern('[\\n\'a-zA-ZÀ-ÖØ-öø-ÿ0-9,;. -]*')])
  });

  constructor(private categoriesServices: CategoriesServicesService, private dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.categoriesServices.getCategoriesList().subscribe(
      (result: Categories[]) => {this.categoriesList = result; }
    );
    this.categoriesServices.getAllColors().subscribe(
      (result) => {this.colorsGlobalList = result; },
      (error: HttpErrorResponse) => {if (error) {this.errorMessage = 'Erreur technique: pas de matériaux disponible.'; }}
    );
  }

  // method to get controls of colors FormArray
  getColors(): FormArray {
    return this.editionForm.get('colors') as FormArray;
  }

  // methos to add a FormControl for colors in editionForm
  addColors(e: Event): void {
    e.preventDefault();
    const newColorsControl = this.formBuilder.control('', Validators.required);
    this.getColors().push(newColorsControl);
  }

  // method to remove a FormControl for colors in editionForm
  removeColor(i: number, e: Event): void {
    e.preventDefault();
    this.getColors().removeAt(i);
  }

  // method to generate the select list filtered
  selectedMaterial(i: number, event): void {
    const selectedMaterial = event.target.value;
    this.selectedList[i] = this.colorsGlobalList.filter(c => c.material === selectedMaterial);
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
    const tempItem: Items = new Items();
    tempItem.category = values.category;
    tempItem.name = values.name.charAt(0).toUpperCase() + values.name.substring(1).toLowerCase();
    tempItem.colors = values.colors;
    let colorsIdentity = '';
    tempItem.colors.forEach(color => {colorsIdentity += color.id + '.'; });
    const colorNumber = ' / CL.' + colorsIdentity;
    tempItem.reference = values.itemNumber.toUpperCase() + colorNumber;
    tempItem.price = values.price.toFixed(2) * 100;
    tempItem.discountPrice = values.discountPrice.toFixed(2) * 100;
    if (values.qty <= 0) {values.qty = 0; }
    tempItem.quantity = values.qty;
    tempItem.informations = values.technicalInformations;
    tempItem.description = values.description;
    // tempItem.listImagesOfItem =
    console.log(tempItem);
    // call to save in DB
  }

}
