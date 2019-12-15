import { LoginComponent } from './../login/login.component';
import { BadInput } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError  } from 'rxjs';
import { Course } from './../models/course';


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
        console.log(this.headers);
        return this.http.get<Course[]>(this.url,{headers:this.headers})
    }
    get(id):Observable<Course> {
        return this.http.get<Course>(this.url + '/' +id,{headers:this.headers})
    }

    create(resource):Observable<Course> {
        return this.http.post<Course>(this.url,resource,{headers:this.headers})
    }

    update(resourceId,resource):Observable<Course> {
        return this.http.put<Course>(this.url + '/' + resourceId,resource,{headers:this.headers})
    }

    delete(id):Observable<Course> {
        return this.http.delete<Course>(this.url + '/' + id,{headers:this.headers})
    }

    private handleError(error: Response) {
        if (error.status === 400)
            return throwError(new BadInput(error.json()));

        if (error.status === 404)
            return throwError(new NotFoundError());
   }
}
