import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/signin/login.component';
import { CreateAccountComponent } from './login/create-account/create-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth-guard.service';

const appRoutes: Routes = [
    {
        path: 'login', component: LoginComponent
    } 
    ,{
        path: 'signup', component: CreateAccountComponent
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]

    }
    ,{
        path: '', redirectTo: '/login', pathMatch: 'full'
    }
];



@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})


export class AppRoutingModule { }