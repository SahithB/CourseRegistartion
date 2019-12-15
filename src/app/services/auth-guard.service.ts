import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authservice : AuthService , private router: Router) { }
  
  canActivate(){
    if(this.authservice.isLoggedIn()) return true;
    this.router.navigate(['/login']);
    return false;

  }

  
}
