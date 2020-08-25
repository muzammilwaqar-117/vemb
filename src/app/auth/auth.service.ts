import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { AuthLoginData } from './auth-login-data.model';
import { AuthSignupData } from './auth-signup-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl +"/user/";
@Injectable({providedIn: "root"})

export class AuthService
{
  private unverifiedUsers: AuthSignupData[] = [];
  private userstatus:AuthSignupData;
  private unverifiedUsersUpdated= new Subject<{unverifiedUsers: AuthSignupData[],unverifiedUsersCount:number}>();
  private token :string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer :any;
  private userId: string;
  private temp =  new Subject<string>();
  private currentUser:string;
  private accountstatus=  new Subject<string>();
  //private accountstatus: string;
  private userDeatils: AuthSignupData;
  constructor(private http : HttpClient, private router: Router){}

  getIsAuth()
  {
    return this.isAuthenticated;
  }

  getUserId()
  {
    return this.userId;
  }


  getToken()
  {
    return this.token;
  }

  getAuthStatusListener()
  {
    return this.authStatusListener.asObservable();
  }


  createUser(fullName:string, email:string, password:string, phoneNumber:string, fullAddress:string, cnicNumber:string,dob:string,genderStatus:string ,/*accountStatus:string,*/ image:File)
  {

    const authData = new FormData();
    authData.append("fullName",fullName);
    authData.append("email",email);
    authData.append("password",password);
    authData.append("phoneNumber",phoneNumber);
    authData.append("fullAddress",fullAddress);
    authData.append("cnicNumber",cnicNumber);
    authData.append("dob",dob);
    authData.append("genderStatus",genderStatus);
    authData.append("image",image);

   // const avialblecheck = this.http.get(BACKEND_URL+"userdetails",cnicNumber)
   if(this.getuserDeatils(cnicNumber))
   {
    alert("CNIC already in Use");
   }
   else
   {
    this.http.post<{message :string, user:AuthSignupData }>
      (BACKEND_URL+"signup",authData)
      .subscribe((responseData)=>{

       this.router.navigate(["/"]);
  },error => {
    this.authStatusListener.next(false);
  }
  );
  this.router.navigate(["/"]);


   }


  }

deleteUser(cnicNumber :number)
{
 return  this.http.delete(BACKEND_URL+cnicNumber);

}


login(cnicNumber: string, password: string)
  {
    const authData: AuthLoginData = {cnicNumber: cnicNumber, password:password};
    this.http.post<{token: string, expiresIn:number ,userId:string, accountStatus:string, authorizedStatus:Boolean}>(BACKEND_URL+"login",authData)
      .subscribe(response =>
        {
          const token = response.token;
          this.token =token;
          if(token)
          {

            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            //this.accountstatus = response.accountStatus;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration *1000);
            this.saveAuthData(token,expirationDate,this.userId);
            if(response.accountStatus =='user')
            {
              this.router.navigate(["/"]);
            }
            else if(response.accountStatus =='admin')
            {
              this.router.navigate(["/auth/admin"]);
              //console.log(response.accountStatus);
            }

          }

        }, error => {
              this.authStatusListener.next(false);
        });
        this.currentUser = cnicNumber;
        //console.log(this.getuserDeatils(this.currentUser));
        /*this.getuserDeatils(this.currentUser).subscribe(res =>
          {
            this.userstatus.fullName = res.fullName,
            this.userstatus.email = res.email,
            this.userstatus.fullAddress = res.fullAddress,
            this.userstatus.phoneNumber = res.phoneNumber,
            this.userstatus.cnicNumber= res.cnicNumber,
            this.userstatus.dob = res.dob,
            this.userstatus.genderStatus = res.genderStatus
          });*/
          //console.log(this.userstatus);
        //this.getaccountStatus();
        //console.log(this.accountstatus);
        //console.log(this.currentUser);
      // console.log( this.getuserDeatils(this.currentUser))
  }

  autoAuthUser()
  {
    const authInformation = this.getAuthData();
    if(!authInformation)
    {
      return;
    }
    const now = new Date();
    const expiresIn =authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0)
    {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId =authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }


  logout()
  {
    this.token =null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId =null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration:number)
  {
    this.tokenTimer= setTimeout(() => {
      this.logout();
    },duration * 1000);
  }

  private saveAuthData(token:string, expirationDate: Date, userId:string)
  {
    localStorage.setItem('token',token);
    localStorage.setItem("expiration",expirationDate.toISOString());
    localStorage.setItem("userId",userId);
  }

  private clearAuthData()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData()
  {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate)
    {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  getUnverifiedUsers()
  {

    //const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ users:any }>(BACKEND_URL+"/unverifiedusers")
     .subscribe(response =>
      {
        var i;
        for (i = 0; i < response.users.length; i++)
        {
          this.unverifiedUsers[i] = response.users[i];
        }

      })

      return this.unverifiedUsers;

      //return this.unverifiedUsers;
  }
  getUnverifiedUsersupdate()
  {
    return  this.unverifiedUsersUpdated.asObservable();
  }

  getUUsersDeatils()
  {
    return  this.userDeatils;
  }

  unverifieduserdata(unverifieduser:any)
  {
    this.unverifiedUsers = unverifieduser;
  }

  getuserDeatils(cnic:string)
  {

    return this.http.get<
    {
      _id:string,
      fullName:string,
      email:string,
      phoneNumber:string,
      fullAddress:string,
      cnicNumber:number,
      dob:Date,
      genderStatus:string,
      accountStatus:string,
      imagePath:string,
      authorizedStatus:boolean
    }>(BACKEND_URL+"userdetails/"+cnic);
  }

  getaccountStatus()
  {
    this.getuserDeatils(this.currentUser)
    this.http.get<{ users:any }>(BACKEND_URL+"/userdetails")
     .subscribe(response =>
      {
        var i;
        for (i = 0; i < response.users.length; i++)
        {
          this.unverifiedUsers[i] = response.users[i];
        }
        //console.log(response.users.length);
      })
      /*var a;
      for(a=0; a< 6;a++)
      {
        console.log(this.unverifiedUsers[a]);
      }*/
     // console.log(this.unverifiedUsers);
      return this.unverifiedUsers;
  }

  userProfileDetails()
  {
    const user = this.getuserDeatils(this.currentUser);

  }

  approveUser(cnicNumber:number)
  {
    const tempstatus = true;
    this.http.put(BACKEND_URL+cnicNumber,tempstatus)
    .subscribe(response => {
      this.router.navigate(["/admin"]);
    });

    //this.http.put<{cnicNumber:number}>(BACKEND_URL+cnicNumber).subscribe(res =>{})
  }

}
//
