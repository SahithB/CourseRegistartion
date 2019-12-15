import { LoginComponent } from './../login/login.component';
import { BadInput } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { throwError  } from 'rxjs';
import { Course } from './../models/course';
import { UnexpectedError } from '../common/unexpected-error';


@Injectable()
export class CourseService{
  url = 'http://localhost:3000/api/courses';
  token;
  headers;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('x-auth-token');
      this.headers = new  HttpHeaders().set("x-auth-token", this.token);
    }

    getAll():Observable<Course[]> {
        return this.http.get<Course[]>(this.url,{headers:this.headers}).pipe(timeout(10000),catchError(this.handleError))
    }
    get(id):Observable<Course> {
        return this.http.get<Course>(this.url + '/' +id,{headers:this.headers}).pipe(timeout(10000),catchError(this.handleError))
    }

    create(resource):Observable<Course> {
        return this.http.post<Course>(this.url,resource,{headers:this.headers}).pipe(timeout(10000),catchError(this.handleError))
    }

    update(resourceId,resource):Observable<Course> {
        return this.http.put<Course>(this.url + '/' + resourceId,resource,{headers:this.headers}).pipe(timeout(10000),catchError(this.handleError))
    }

    delete(id):Observable<Course> {
        return this.http.delete<Course>(this.url + '/' + id,{headers:this.headers}).pipe(timeout(10000),catchError(this.handleError))
    }

    private handleError(error: Response) {
        if (error.status === 400)
            return throwError(new BadInput(error.json()));

        if (error.status === 404)
            return throwError(new NotFoundError());
        return throwError(new UnexpectedError());
   }
}
