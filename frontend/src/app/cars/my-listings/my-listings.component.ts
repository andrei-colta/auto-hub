import { Component, OnInit } from '@angular/core';
import { CarsService } from '../cars.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-my-listings',
    templateUrl: './my-listings.component.html',
    styleUrls: ['./my-listings.component.css']
})
export class MyListingsComponent implements OnInit {

    listings = [];

    constructor(private carsService: CarsService, private router: Router) { }

    ngOnInit() {
        this.getAll();
    }

    getAll() {
        this.carsService.getCarsByUserId().then((response) => {
            if (response.status === 'DataRetrieved') {
                this.listings = response.data;
                for (const l of this.listings) {
                    this.carsService.getPictures(l._id).then((resp) => {
                        if (resp.status === 'DataRetrieved') {
                            if (resp.data && resp.data.length > 0) {
                                l.displayPicture = resp.data[0];
                            }
                        }
                    });
                }
            }
        });
    }

    deleteListing(listing) {
        this.carsService.deleteCar(listing._id).then((response) => {
            if (response.status === 'DataDeleted') {
                this.listings.splice(this.listings.indexOf(listing), 1);
            }
        });
    }

}
