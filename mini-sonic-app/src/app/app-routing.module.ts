import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/signin/login.component';
import { CreateAccountComponent } from './login/create-account/create-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth-guard.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AddOperationComponent } from './dashboard/add-operation/add-operation.component';
const appRoutes: Routes = [
    {
        path: 'login', component: LoginComponent
    }
    , {
        path: 'signup', component: CreateAccountComponent
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]

    },
    { path: 'dashboard/add-operation', component: AddOperationComponent, canActivate: [AuthGuard] }
    , {
        path: '', redirectTo: '/login', pathMatch: 'full'
    },
    { path: 'not-found', component: ErrorPageComponent, data: ['Page not found'] },

    { path: '**', redirectTo: '/not-found', pathMatch: 'full' }
];



@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})


export class AppRoutingModule { }