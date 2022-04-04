import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { empty } from 'rxjs';
import { from } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private http: HttpClient, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Intercepted!', req);
        const id = localStorage.getItem('user_id');
        let newParams = new HttpParams({ fromString: req.params.toString() });

        if (id) {
            newParams = newParams
                .append('user_id', (id ? id : ''));
        }

        let copiedReq = req.clone();
        copiedReq = copiedReq.clone({ params: newParams });

        const fileupload = req.url.indexOf('uploadPicture') + req.url.indexOf('uploadFiles');
        if (!copiedReq.headers.has('Content-Type') && fileupload <= 0) {
            copiedReq = copiedReq.clone({
                headers: copiedReq.headers.set('Content-Type', 'application/json'),
            });
        }
        console.log('Intercepted after added header', copiedReq);

        return next.handle(copiedReq);
    }
}
