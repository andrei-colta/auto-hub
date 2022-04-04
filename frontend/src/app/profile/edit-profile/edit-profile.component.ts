import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AccessService } from 'src/app/access/access.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    profileData: any = {
        id: '',
        firstName: '',
        lastName: '',
        birthday: '',
        country: '',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        city: '',
    };

    hasAlert;
    alertText;
    alertType;

    selectedFile = null; // poza
    fd = new FormData();
    uploadPic = true;
    picAlert;
    myPicture;
    oldPicture;
    firstPicChange = true;
    picURL;

    // fields for image cropper
    imageChangedEvent: any = '';
    croppedImage: any = '';
    CropTitleVisible: any;
    cropperReady = false;
    croppedfile;
    pTooltip: any;

    today = new Date();

    cities;
    selectedCity;

    constructor(private profileService: ProfileService, private http: HttpClient, private accessService: AccessService) { }

    ngOnInit() {
        this.getProfile();
        this.loadCities();
    }

    getProfile() {
        this.profileService.getEditProfile().then((response) => {
            console.log(response);
            if (response.status === 'DataRetrieved') {
                response.data.birthday = new Date(response.data.birthday);
                this.profileData = response.data;

                this.myPicture = response.data.picture;
            }
        });
    }

    updateProfile() {
        if (this.profileData.firstName && this.profileData.lastName) {
            this.profileService.updateProfile(this.profileData).then((response) => {
                console.log(response);
                if (response.status === 'DataUpdated') {
                    this.getProfile();
                }
            });
        }
    }

    loadCities() {
        this.profileService.getCities(this.profileData.country)
            .then((response: any) => {
                if (response.status === 'DataRetrieved') {
                    this.cities = response.data;
                }
            });
    }

    searchCity(term, item) {
        if (item.toString().toLowerCase().startsWith(term.toLowerCase())) {
            return true;
        }
        return false;
    }

    searchCountry(term, item) {
        if (item.name.toString().toLowerCase().startsWith(term.toLowerCase())) {
            return true;
        }
        return false;
    }

    upload() {
        if (this.selectedFile) {
            const file = this.selectedFile.target.files[0];

            const url = this.profileService.uploadPictureURL;

            const formData: FormData = new FormData();
            formData.append('picture', file, file.name);

            const req = new HttpRequest('POST', url, formData);

            this.http.request(req).subscribe((response: any) => {
                console.log(response);
                if (response.body) {
                    localStorage.setItem('picture', response.body.name);
                    this.accessService.loggedObservable.next(true);
                    this.imageChangedEvent = false;

                    this.getProfile();
                }
            });
        }
    }

    createFormData(file) {
        this.selectedFile = file;
        this.imageChangedEvent = true;

        this.upload();
    }

    cancelEditPicture() {
        this.selectedFile = false;
        this.imageChangedEvent = false;
    }
}
