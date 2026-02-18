import { Injectable } from "@angular/core";
import { LoginService } from "./login.service";
import { User } from "./user.model";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({ providedIn: 'root' })

export class AuthService {

    constructor(private loginService: LoginService,
        private jwtHelper: JwtHelperService
    ) { }



    login(email : string, password :string) {

        const user =this.loginService.isValidLogin(email, password);
        if (user) {
            const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
            const payload = btoa(JSON.stringify({
                userID: user.id,
                email: user.email,
                exp:  Math.floor(Date.now() / 1000) + 3600,
                role: user.name === 'admin' ? 'admin' : 'user'
            }));
            const signature = btoa('secret-only');
            const token = `${header}.${payload}.${signature}`;
            localStorage.setItem('jwt', token);
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('jwt');
    }

    isLoggedIn() {
        const token = localStorage.getItem('jwt');
        return !!token && !this.jwtHelper.isTokenExpired(token);
    }
    isAuthenticated(): Promise<boolean> {
        return new Promise<boolean>(
            (resolve) => {
                setTimeout(() => { resolve(this.isLoggedIn()) }, 80);
            }
        );
    }
    getActiveUser(): any {
        const token = localStorage.getItem('jwt');
        if (!token) return null;
        return this.jwtHelper.decodeToken(token);
    }
}