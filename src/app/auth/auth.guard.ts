import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate
{
  constructor(private authservice: AuthService, private router:Router){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    boolean |
    //import("@angular/router").UrlTree
    //| import("rxjs").Observable<boolean
    //| import("@angular/router").UrlTree>
    //| Promise<boolean
    //| import("@angular/router").UrlTree>
    //the above commented statemetsn were created by the ide
    Observable<boolean> |
     Promise<boolean>
  {
    const isAuth = this.authservice.getIsAuth();
    if(!isAuth)
    {
      //this  below commneted auth guard broke down while optimizing
      this.router.navigate(['/auth/login']);
      //this.router.navigate(['/login']);
    }
    return isAuth;
  }

}
