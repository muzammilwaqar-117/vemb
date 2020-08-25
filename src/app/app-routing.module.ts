import { NgModule } from "@angular/core";
import { RouterModule,Routes, ROUTES} from "@angular/router";
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { UserProfileComponent } from '../app/auth/user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';
const routes: Routes=[
  { path:'', component: PostListComponent },
  { path:'home',component:HomeComponent },
  { path:'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path:'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path:'userprofile', component: UserProfileComponent, canActivate: [AuthGuard] },
  //this wont work in the newer version
  //another way to load children is
  { path:"auth",loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];

@NgModule(
{
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule
{

}
