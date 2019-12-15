import { LoginComponent } from './../login/login.component';
import { BadInput } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError  } from 'rxjs';
import { Registration } from './../models/registration';


@Injectable()
export class RegistrationService{
  url = 'http://localhost:3000/api/registrations';
  token;
  headers;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('x-auth-token');
    this.headers = new  HttpHeaders().set("x-auth-token", this.token);
    }

    getAll():Observable<Registration[]> {
        return this.http.get<Registration[]>(this.url,{headers:this.headers})
    }
    get(id):Observable<Registration> {
        return this.http.get<Registration>(this.url + '/' +id,{headers:this.headers})
    }

    create(resource):Observable<Registration> {
        return this.http.post<Registration>(this.url,resource,{headers:this.headers})
    }

    update(resourceId,resource):Observable<Registration> {
        return this.http.put<Registration>(this.url + '/' + resourceId,resource,{headers:this.headers})
    }

    delete(id):Observable<Registration> {
        return this.http.delete<Registration>(this.url + '/' + id,{headers:this.headers})
    }

    private handleError(error: Response) {
        if (error.status === 400)
            return throwError(new BadInput(error.json()));

        if (error.status === 404)
            return throwError(new NotFoundError());
   }
}
