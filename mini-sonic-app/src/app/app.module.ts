import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { LoginComponent } from "./login/signin/login.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {MatIconModule} from '@angular/material/icon'
import { NgIf } from "@angular/common";
import { CreateAccountComponent } from "./login/create-account/create-account.component";
import { LoginService } from "./login/login.service";
import { ToastrModule } from "ngx-toastr";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NotificationsService } from "./notification.service";

import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

@NgModule({
    declarations: [AppComponent, LoginComponent,CreateAccountComponent,DashboardComponent],
    imports: [AppRoutingModule, BrowserModule, BrowserAnimationsModule,
        MatButtonModule, MatCardModule, MatInputModule,NgIf,MatIconModule,ReactiveFormsModule, 
        ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        closeButton: true
    }),
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter,
            allowedDomains:[],
            disallowedRoutes:[]
          }  
        })],
    bootstrap: [AppComponent],
    providers:[LoginService,NotificationsService]
})



export class AppModule { }
