import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';

import { PostModule } from './posts/posts.module';

import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';
import { FotterComponent } from './fotter/fotter.component';
import { SideBarComponent } from './sidebar/sidebar.component';
import { UserProfileComponent } from '../app/auth/user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    FotterComponent,
    SideBarComponent,
    UserProfileComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    PostModule

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }

