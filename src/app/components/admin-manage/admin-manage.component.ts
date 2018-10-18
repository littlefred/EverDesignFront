import { ItemsServicesService } from './../../services/items-services.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss']
})
export class AdminManageComponent implements OnInit {
  panelOpenState = false;

  constructor(private itemsServices: ItemsServicesService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  // method to add an item
  addItem(): void {
    this.itemsServices.setScreenObs('editionItem');
    this.itemsServices.setCategoryIdSelected(0);
  }

  // method to add a category
  addCategory(e: Event): void {
    e.preventDefault();
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        view: 'addCategory'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'erreurSvg') {
        this.snackBar.open('Erreur lors de l\'enregistrement de la catégorie', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snackbarError']
        });
      }
      if (result === 'okSvg') {
        this.snackBar.open('Votre catégorie a bien été créée', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snackbar']
        });
      }
    });
  }

  // method to add a category
  addMaterial(e: Event): void {
    e.preventDefault();
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        view: 'createMaterial'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'erreurSvg') {
        this.snackBar.open('Erreur lors de l\'enregistrement du matériaux', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snackbarError']
        });
      }
      if (result === 'okSvg') {
        this.snackBar.open('Votre matériaux a bien été créé', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snackbar']
        });
      }
    });
  }

}
