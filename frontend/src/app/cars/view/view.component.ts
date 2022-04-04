import { Component, OnInit, ɵConsole } from '@angular/core';
import { CarsService } from '../cars.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

    id;
    carData;
    userData;
    pictures;
    userId;

    selectedPic;
    selectedModalPic;
    showModal;

    picsInPreview = 8;

    constructor(private carsService: CarsService, private route: ActivatedRoute, private profileService: ProfileService) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.getCar();
        this.getPictures();
    }

    getCar() {
        this.carsService.getCar(this.id).then((response) => {
            if (response.status === 'DataRetrieved') {
                this.carData = response.data;
                this.userId = this.carData.user_id;
                this.getUser();
            }
        });
    }

    getPictures() {
        this.carsService.getPictures(this.id).then((response) => {
            if (response.status === 'DataRetrieved') {
                this.pictures = response.data;
                if (this.pictures.length > 0) {
                    this.selectedPic = this.pictures[0];
                }
            }
        });
    }

    getUser() {
        this.profileService.getProfile(this.userId).then((response) => {
            if (response.status === 'DataRetrieved') {
                this.userData = response.data;
            }
        });
    }

    viewPicture() {
        this.selectedModalPic = this.selectedPic;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    changePic(deltaIdx) {
        const currentIndex = this.pictures.indexOf(this.selectedPic);

        let newIndex = (currentIndex + deltaIdx) % this.pictures.length;

        if (newIndex < 0) {
            newIndex = this.pictures.length - 1;
        }
        this.selectedPic = this.pictures[newIndex];
    }

    changeModalPic(deltaIdx) {
        const currentIndex = this.pictures.indexOf(this.selectedModalPic);

        let newIndex = (currentIndex + deltaIdx) % this.pictures.length;

        if (newIndex < 0) {
            newIndex = this.pictures.length - 1;
        }
        this.selectedModalPic = this.pictures[newIndex];
    }
}
