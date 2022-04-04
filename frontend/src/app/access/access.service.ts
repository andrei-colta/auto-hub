import { Injectable, OnInit } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccessService implements OnInit {
    rootURL = 'http://localhost:1234/access/';
    carsRootURL = 'http://localhost:1234/cars/';
    signupURL = this.rootURL + 'signup';
    loginURL = this.rootURL + 'login';
    getPictureURL = this.carsRootURL + 'getPicture';
    alertTimeout = 2000;

    loggedObservable = new Subject<boolean>();

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loggedObservable.next(localStorage.getItem('user_id') !== null);
    }

    signup(email, password) {
        console.log('email is ' + email);
        const input = {
            email: email,
            password: password // sha256(password).toString()
        };

        return new Promise<any>((resolve) => {
            this.http.post(this.signupURL, input)
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }

    login(email, password) {
        const input = {
            email: email,
            password: password// sha256(password).toString()
        };

        return new Promise<any>((resolve) => {
            this.http.post(this.loginURL, input)
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    logout() {
        localStorage.clear();
        this.loggedObservable.next(false);
    }
}
