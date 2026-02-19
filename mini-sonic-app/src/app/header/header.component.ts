import { Component, Input, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { AuthService } from '../login/auth.service';
import { User } from '../login/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user : User | undefined;
  jwt :any;
  dropdownOpen = false;
  @Input() pageTitle : string = 'Dashboard'
  constructor(private authService  :AuthService, 
              private loginService : LoginService,
              private router : Router){}
  
  ngOnInit(): void {
     this.jwt = this.authService.getActiveUser();
    if (this.jwt){
      this.user = this.loginService.users.find(u => u.id === this.jwt.userID);
    }
  }
  toggleDropdown(){
    this.dropdownOpen = !this.dropdownOpen;
  }
  onLogout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  getInitials(): string {
    if (!this.user?.name) return '?';
    return this.user.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
