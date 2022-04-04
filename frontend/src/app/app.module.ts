import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from 'src/common/navbar/navbar.component';
import { LoginComponent } from './access/login/login.component';
import { SignupComponent } from './access/signup/signup.component';
import { AccessModule } from './access/access.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileModule } from './profile/profile.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile/profile.component';
import { CarsModule } from './cars/cars.module';
import { SearchComponent } from './cars/search/search.component';
import { AddComponent } from './cars/add/add.component';
import { MyListingsComponent } from './cars/my-listings/my-listings.component';
import { ViewComponent } from './cars/view/view.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AccessModule,
        NgbModule,
        BrowserAnimationsModule,
        ProfileModule,
        CarsModule,
        RouterModule.forRoot([
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'edit-profile', component: EditProfileComponent },
            { path: 'profile/:id', component: ProfileComponent },
            { path: 'addListing', component: AddComponent },
            { path: 'addListing/:id', component: AddComponent },
            { path: 'myListings', component: MyListingsComponent },
            { path: 'view/:id', component: ViewComponent },
            { path: 'search', component: SearchComponent },
            { path: '', component: SearchComponent }
        ])
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule { }
