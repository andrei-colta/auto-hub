import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccessService } from './access.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [LoginComponent, SignupComponent],
    providers: [AccessService]
})
export class AccessModule { }
