import { AuthResult } from './../models/authResult';
import { BadInput } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError  } from 'rxjs';


@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(credentials){
     return this.http.post<AuthResult>('http://localhost:3000/api/auth', credentials)
      .pipe(map(response => {
        let result = response;
        if (result && result.token) {
          localStorage.setItem('x-auth-token', result.token);
          return true;
        }
        else{
          return false;
        }
      }),catchError(this.handleError)
      )
      
  }
  logout() {
    localStorage.removeItem('x-auth-token');
  }
  isLoggedIn() {
     let token = localStorage.getItem('x-auth-token');
     if(!token) return false;
    return true;
  }
  private handleError(error: Response) {
    if (error.status === 400){
        return throwError(new BadInput());
    }
    if (error.status === 404)
      
        return throwError(new NotFoundError());

    return Observable.throw(new AppError(error));
}
}

