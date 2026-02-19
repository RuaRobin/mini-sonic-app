import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { matchFieldsValidator } from '../../validators/match-fields-validator';
import { emailWithTLDValidator } from '../../validators/email-validators';
import { LoginService } from '../login.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NotificationsService } from '../../notification.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent implements OnInit {
  hidePassword = true;
  hideConfirmedPassword = true;
  signupForm!: FormGroup;
  statusMessage!: string;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private notificationService: NotificationsService,
  private authService: AuthService ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        emailWithTLDValidator()
      ]], username: ['', [Validators.required, Validators.maxLength(250)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: matchFieldsValidator }
    )

  }

  onRegister() {

    const form = this.signupForm.value;
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    console.log('Registration form values:', form);
    const newUser= {
      id: 1,
      name: form.username,
      email: form.email,
      password: form.newPassword
    }; 
    if (this.loginService.addNewUser(newUser)) {
      this.notificationService.showSuccessMsg("Account Created Successfully.")
      this.authService.login(newUser.email,newUser.password);
      setTimeout(() => { this.router.navigate(['/dashboard']) }, 2000)
    }
    else {
      this.notificationService.showWarningMsg("This Account Already Exists.");
      this.statusMessage = "This Account Already Exists.";
    }


  }

}
