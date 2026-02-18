import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { emailWithTLDValidator } from '../../validators/email-validators';
import { LoginService } from '../login.service';
import { NotificationsService } from '../../notification.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})


export class LoginComponent implements OnInit {

  hide = true;
  loginForm!: FormGroup;
  statusMessage! :string ;


  constructor(private fb: FormBuilder,
              private router : Router,
              private loginService: LoginService,
              private notificationService : NotificationsService,
              private authService : AuthService
  ) { }

  ngOnInit() { 
 this.loginForm = this.fb.group({
    email: ['', [
      Validators.required, 
      Validators.email,           
      emailWithTLDValidator()     
    ]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  }
  onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const form = this.loginForm.value;
    console.log(form);
    const user = this.loginService.getUser(form.email);
    if(user)
    {
      if  (this.authService.login(form.email,form.password)){
        this.statusMessage= "Login Successful";
        setTimeout( ()=> {this.router.navigate(['dashboard'])}, 1000);
      } else {
        this.notificationService.showErrorMsg("Password is incorrect.");
        this.statusMessage= "Password is incorrect.";
      } 
    } else {
      this.notificationService.showWarningMsg("User doesn't exist.")
      this.statusMessage = "User doesn't exist. ";
      return;
    }
  }

  onCreateNewAccount(){
    this.router.navigate(['../signup'])

  }
}
