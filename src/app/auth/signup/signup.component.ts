import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from '../../posts/post-create/mime-type.validator';

@Component({

selector: 'app-signup',
templateUrl:'./signup.component.html',
styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy
{

  isLinear = false;
  /*firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
*/

  isloading =false;
  private authStatusSub: Subscription;
  signupform : FormGroup;
  imagePreview : string;
  profileImage : string;
  accountStatus:string;
  accStatus: string[] = ['user','admin'];
  genderStatus:string[] = ['Male','Female'];


  constructor(public authService: AuthService,public route: ActivatedRoute, private _formBuilder: FormBuilder){}

  ngOnInit()
  {
    /*
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });*/

  this.authStatusSub =  this.authService.getAuthStatusListener().
  subscribe(authStatus => {
    this.isloading = false;
  });
  this.signupform = new FormGroup(
    {
      fullName: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      email: new FormControl(null, {validators:[Validators.required, Validators.email]}),
      password: new FormControl(null, {validators:[Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]}),
      phoneNumber: new FormControl(null, {validators:[Validators.required, Validators.minLength(11),Validators.maxLength(11)]}),
      fullAddress: new FormControl(null, {validators:[Validators.required]}),
      cnicNumber: new FormControl(null, {validators:[Validators.required, Validators.minLength(13), Validators.maxLength(13)]}),
      dob: new FormControl(null, {validators:[Validators.required]}),
      genderStatus: new FormControl(null, {validators:[Validators.required]}),
      //accountStatus: new FormControl(null,{validators:[Validators.required]}),
      image : new FormControl(null,{validators: [Validators.required], asyncValidators :[mimeType]})

    });


  }


  onSignup()
  {
    if(this.signupform.invalid)
    {
      //console.log("onsignup invalid failed");
      return;
    }
    else
    {
      this.isloading = true;

    //this.authService.createUser(form.value.fullName, form.value.email, form.value.password, form.value.phoneNumber, form.value.fullAddress, form.value.cnicNumber );
    this.authService.createUser(
      this.signupform.value.fullName,
      this.signupform.value.email,
      this.signupform.value.password,
      this.signupform.value.phoneNumber,
      this.signupform.value.fullAddress,
      this.signupform.value.cnicNumber,
      this.signupform.value.dob,
      this.signupform.value.genderStatus,
      //this.signupform.value.accountStatus,
      this.signupform.value.image);
      //console.log("onsignup form sucessful");

      this.isloading =false;
    //console.log(form.value.accountStatus);
    }
    this.signupform.reset();
  }

  //on image picked
  onImagePicked(event : Event)
  {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupform.patchValue({image: file});
    this.signupform.get('image').updateValueAndValidity();
    const reader = new FileReader();
    //console.log(file);
    //console.log(this.signupform);
    reader.onload = () =>
    {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    //reader.onload and reader.readAsDataURL works asynchronusly
  }
  //end of on image picked


  ngOnDestroy()
  {
    this.authStatusSub.unsubscribe();
  }
}
