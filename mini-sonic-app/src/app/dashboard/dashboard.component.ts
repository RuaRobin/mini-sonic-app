import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { User } from '../login/user.model';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: false
})
export class DashboardComponent implements OnInit {
  user! : User | undefined;
  
  constructor(private authService : AuthService,
              private loginService : LoginService
  ){

  }

  ngOnInit(){
    const jwt = this.authService.getActiveUser();
    this.user = this.loginService.users.find((u)=> u.id === jwt.userID)
  }

}
 