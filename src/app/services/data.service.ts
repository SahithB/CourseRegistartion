import { LoginComponent } from './../login/login.component';
import { BadInput } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError  } from 'rxjs';

@Injectable()
export class DataService {
    token;
    headers;
    modelType;
    constructor(private url: string, private http: HttpClient) { 
        this.token = localStorage.getItem('x-auth-token');
        this.headers = new Headers({'x-auth-token': this.token});
    }

    

    getAll() {
        return this.http.get(this.url,{headers:this.headers})
            .pipe(map(response => response),
                catchError(this.handleError)
            )

    }
    get(id) {
        return this.http.get(this.url + '/' +id,{headers:this.headers})
            .pipe(map(response => response),
                catchError(this.handleError)
            )

    }

    create(resource) {
        return this.http.post(this.url,resource,{headers:this.headers})
            .pipe(map(response => response),
                catchError(this.handleError)
            )
    }

    update(resourceId,resource) {
        return this.http.put(this.url + '/' + resourceId,resource,{headers:this.headers})
            .pipe(map(response => response),
                catchError(this.handleError)
            )
    }

    delete(id) {
        return this.http.delete(this.url + '/' + id,{headers:this.headers})
            .pipe(map(response => response),
                catchError(this.handleError)
            )
    }

    private handleError(error: Response) {
        if (error.status === 400)
            return throwError(new BadInput(error.json()));

        if (error.status === 404)
            return throwError(new NotFoundError());

        return Observable.throw(new AppError(error));
    }
}
