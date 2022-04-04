import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from '../access.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    hasAlert;
    alertText;

    constructor(private router: Router, private accessService: AccessService) { }

    ngOnInit() {
    }

    login() {
        if (this.email.value && this.password.value) {// && this.loginForm.valid) {
            this.accessService.login(this.email.value, this.password.value)
                .then((response) => {
                    console.log(response);
                    if (response.status === 'LoginSuccessful') {
                        localStorage.clear();
                        localStorage.setItem('email', this.email.value);
                        localStorage.setItem('user_id', response.data._id);
                        localStorage.setItem('picture', response.data.picture);
                        // do stuff
                        this.router.navigate(['/edit-profile']);
                    } else {
                        this.hasAlert = true;
                        if (response.status === 'WrongPassword') {
                            this.alertText = 'Incorrect password!';
                        } else {
                            this.alertText = 'No account for this email address. Please sign up.';
                        }
                    }
                });
        } else {
            this.hasAlert = true;
            this.alertText = 'Please enter a valid email and password.';
        }
    }

}
