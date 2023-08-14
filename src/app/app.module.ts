import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AddItemComponent } from '../app/add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { AddWishComponent } from './add-wish/add-wish.component';
import { EditWishComponent } from './edit-wish/edit-wish.component';
import { LoginPageModule } from './login/login.module';
import { RegisterNewUserComponent } from './register-new-user/register-new-user.component';
import { Helpers } from './helpers/helpers';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent, 
    AddItemComponent, 
    EditItemComponent, 
    AddWishComponent, 
    EditWishComponent, 
    RegisterNewUserComponent
  ], 
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    LoginPageModule,
    AppRoutingModule, 
    FormsModule, 
    RouterModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt' },
    Helpers
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
