import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminComponent } from './admin/admin.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModuel } from './auth-routing.module';
//import { UserProfileComponent } from '../user-profile/user-profile.component';

@NgModule({
  declarations:
    [
      LoginComponent,
      SignupComponent,
      AdminComponent
    ],
  imports:
    [
      CommonModule,
      AngularMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      AuthRoutingModuel
    ]
})

export class AuthModule
{

}
