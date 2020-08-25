import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes =[
  { path:'login',component:LoginComponent},
  { path:'signup',component: SignupComponent},
  { path: 'admin', component: AdminComponent }
]

@NgModule({
  imports:[
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})

export class AuthRoutingModuel
{

}
