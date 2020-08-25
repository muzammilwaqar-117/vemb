import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../posts/post.model';
import { AuthSignupData } from '../auth-signup-data.model';
import { PostsService } from '../../posts/posts.service';
import {Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';


@Component(
{
  selector: 'app-admin',
  templateUrl:'./admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit, OnDestroy
{

unverifiedUsers: AuthSignupData[] = [];
isloading =false;
totalUnverifiedUsers = 0;
unverifiedUsersPerPage = 5;
currentPage = 1;
pageSizeOptions = [1,2,5,10];
userId :string;
private postsSub: Subscription;
private authServiceSub : Subscription;
userIsAuthenticated =false;
accountStatus:string;
verified:boolean ;






constructor(public authService: AuthService)
{}


ngOnInit()
  {this.isloading=true;
    this.unverifiedUsers = this.authService.getUnverifiedUsers();

   // this.userId = this.authService.getUserId();
    /*this.authServiceSub = this.authService.getUnverifiedUsersupdate()
      .subscribe((userData: {unverifiedUsers:AuthSignupData[], unverifiedUsersCount:number})=>
      {
        this.isloading=false;
        this.totalUnverifiedUsers = userData.unverifiedUsersCount;
        this.unverifiedUsers = userData.unverifiedUsers;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
*/
    this.isloading=false;
  }


onChangedPage(pageData: PageEvent)
{
  this.currentPage = pageData.pageIndex +1;
  this.unverifiedUsersPerPage = pageData.pageSize;
  this.authService.getUnverifiedUsers();
}

ngOnDestroy()
{}

onDelete(cnicNumber: number)
{
  this.isloading = true;
  this.authService.deleteUser(cnicNumber).subscribe(()=>
  {
    this.authService.getUnverifiedUsers();
  },()=>
  {
    this.isloading=false;
  });
}

onApprove(cnicNumber:number)
{
  this.isloading=true;

}

}
