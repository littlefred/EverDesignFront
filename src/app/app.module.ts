import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatPaginatorModule, MatSelectModule,
  MatOptionModule,
  MatTableModule,
  MatDialogModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatExpansionModule} from '@angular/material';
import { CategoriesComponent } from './components/categories/categories.component';
import { MainNavComponent } from 'src/app/components/main-nav/main-nav.component';
import { HttpClientModule } from '@angular/common/http';
import { ItemsComponent } from './components/items/items.component';
import { ContactComponent } from './components/contact/contact.component';
import { InformationsComponent } from './components/informations/informations.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CaddyComponent } from './components/caddy/caddy.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UsersComponent } from './components/users/users.component';
import { CallBackComponent } from './components/call-back/call-back.component';
import { AdminManageComponent } from './components/admin-manage/admin-manage.component';
import { ItemEditionComponent } from './components/item-edition/item-edition.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    CategoriesComponent,
    ItemsComponent,
    ContactComponent,
    InformationsComponent,
    HeaderComponent,
    CaddyComponent,
    DialogComponent,
    UsersComponent,
    CallBackComponent,
    AdminManageComponent,
    ItemEditionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatDialogModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatExpansionModule
  ],
  entryComponents: [
    DialogComponent
  ],
  providers: [CallBackComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
