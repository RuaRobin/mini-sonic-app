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
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./dashboard/sidebar/sidebar.component";
import { OperationsTableComponent } from "./dashboard/operations-table/operations-table.component";
import { MatTable, MatColumnDef, MatHeaderCell, MatHeaderRowDef, MatCell, MatCellDef } from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import {MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltip } from "@angular/material/tooltip";
export function tokenGetter() {
  return localStorage.getItem('jwt');
}

@NgModule({
    declarations: [AppComponent, LoginComponent,CreateAccountComponent,DashboardComponent,HeaderComponent,SidebarComponent,OperationsTableComponent],
    imports: [AppRoutingModule, BrowserModule, BrowserAnimationsModule,
    MatButtonModule, MatCardModule, MatInputModule, NgIf, MatIconModule, ReactiveFormsModule,
    ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        closeButton: true
    }),
    JwtModule.forRoot({
        config: {
            tokenGetter: tokenGetter,
            allowedDomains: [],
            disallowedRoutes: []
        }
    }), MatTable, MatSort, MatColumnDef, MatHeaderCell, MatHeaderRowDef, MatSortHeader, MatCell, MatCellDef, MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatTooltip],
    bootstrap: [AppComponent],
    providers:[LoginService,NotificationsService]
})



export class AppModule { }
