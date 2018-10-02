import { ItemsServicesService } from './../../services/items-services.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss']
})
export class AdminManageComponent implements OnInit {
  panelOpenState = false;

  constructor(private itemsServices: ItemsServicesService) { }

  ngOnInit() {
  }

  // method to add an item
  addItem(): void {
    this.itemsServices.setScreenObs('editionItem');
    this.itemsServices.setCategoryIdSelected(0);
  }

}
