import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from '../access.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsernameValidators } from 'src/app/validators/username.validators';
import { PasswordValidators } from 'src/app/validators/password.validators';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    signupForm = new FormGroup({
        email: new FormControl('', [UsernameValidators.isEmail, Validators.required]),
        password: new FormControl('', [PasswordValidators.minLength, PasswordValidators.strength, Validators.required])
    });

    get email() {
        return this.signupForm.get('email');
    }

    get password() {
        return this.signupForm.get('password');
    }

    hasAlert;
    alertType = 'red';
    alertText;

    constructor(private router: Router, private accessService: AccessService) { }

    ngOnInit() {
    }

    signup() {
        console.log('email is ' + this.email);
        if (this.email.value && this.password.value && this.signupForm.valid) {
            this.accessService.signup(this.email.value, this.password.value)
                .then((response) => {
                    console.log(response);
                    if (response.status === 'DataInserted') {
                        this.hasAlert = true;
                        this.alertType = 'green';
                        this.alertText = 'Account created successfully!';

                        setTimeout(() => {
                            this.hasAlert = false;
                            this.router.navigate(['/login']);
                        }, this.accessService.alertTimeout);
                    }
                });
        } else {
            this.alertType = 'red';
            this.alertText = 'Please insert a valid email and password!';
        }
    }

}
