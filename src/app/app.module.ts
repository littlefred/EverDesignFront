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
  MatDialogModule} from '@angular/material';
import { CategoriesComponent } from './components/categories/categories.component';
import { MainNavComponent } from 'src/app/components/main-nav/main-nav.component';
import { HttpClientModule } from '@angular/common/http';
import { ItemsComponent } from './components/items/items.component';
import { ContactComponent } from './components/contact/contact.component';
import { InformationsComponent } from './components/informations/informations.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CaddyComponent } from './components/caddy/caddy.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

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
    DialogComponent
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
    MDBBootstrapModule.forRoot()
  ],
  entryComponents: [
    DialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
