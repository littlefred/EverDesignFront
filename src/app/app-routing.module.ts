import { CallBackComponent } from './components/call-back/call-back.component';
import { ItemsServicesService } from './services/items-services.service';
import { UsersComponent } from './components/users/users.component';
import { CaddyComponent } from './components/caddy/caddy.component';
import { InformationsComponent } from './components/informations/informations.component';
import { ContactComponent } from './components/contact/contact.component';
import { ItemsComponent } from './components/items/items.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'items', component: ItemsComponent, resolve: {categoryIdSelectedParam: ItemsServicesService}},
  {path: 'caddy', component: CaddyComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'informations/CGV', component: InformationsComponent},
  {path: 'informations/ML', component: InformationsComponent},
  {path: 'users', component: UsersComponent},
  {path: 'account', component: CallBackComponent, resolve: {callBackInformation: CallBackComponent}},
  {path: '', component: CategoriesComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
