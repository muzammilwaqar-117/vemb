import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
templateUrl:'./login.component.html',
styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnDestroy, OnInit
{
  isloading =false;
  private authStatusSub: Subscription;
  //constructor(public authService:AuthService){}

  constructor(public authService: AuthService){}

  ngOnInit()
  {
  this.authStatusSub =  this.authService.getAuthStatusListener().
  subscribe(authStatus => {
    this.isloading = false;
  });
  }

  onLogin(form : NgForm)
  {
    if(form.invalid)
    {
      return;
    }
    this.isloading = true;
    this.authService.login(form.value.cnicNumber, form.value.password);
    //console.log(form.value.email, form.value.password);
  }

  ngOnDestroy()
  {
    this.authStatusSub.unsubscribe();
  }
}
