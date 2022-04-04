import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CarsService } from '../cars.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    maker;
    allBrands;

    minYear;
    maxYear;
    allYears = [];

    allMinYears = [];
    allMaxYears = [];

    minPrice;
    maxPrice;

    allColors;
    color;

    fuelType;
    allFuelTypes;

    bodyType;
    allBodyTypes;

    results = [];

    @ViewChild('collapseFilters') collapseFilters: ElementRef;

    colfilters: any;

    constructor(private carsService: CarsService, private router: Router) { }

    ngOnInit() {
        for (let y = 2019; y > 1990; y--) {
            this.allYears.push({ value: y, label: y.toString() });
            this.allMinYears.push({ value: y, label: y.toString() });
            this.allMaxYears.push({ value: y, label: y.toString() });
        }

        this.searchCars();
        this.getBrands();
        this.getColors();
        this.getBodyTypes();
        this.getFuelTypes();
    }

    selectMinYear() {
        const newMaxYears = [];
        for (const y of this.allMaxYears) {
            if (y.value < this.minYear.value) {
                console.log('year ' + y.label + ' should be disabled');
                y.disabled = true;
            }
            newMaxYears.push(y);
        }
        // this.allMaxYears = [];
        this.allMaxYears = newMaxYears;

        console.log('selected min year, new max years: ', this.allMaxYears);
    }

    selectMaxYear() {
        const newMinYears = [];
        for (const y of this.allMinYears) {
            if (y.value > this.maxYear.value) {
                y.disabled = true;
            }
            newMinYears.push(y);
        }
        this.allMinYears = newMinYears;
    }

    toggleCol(param) {
        if (param === 0) {
            if (!this.collapseFilters.nativeElement.classList.contains('collapsing')) {
                this.colfilters = !this.colfilters;
            }
        }
    }

    searchCars() {
        const wrapper = {
            maker: (this.maker ? this.maker : ''),
            minYear: (this.minYear ? this.minYear.value : ''),
            maxYear: (this.maxYear ? this.maxYear.value : ''),
            fuelType: (this.fuelType ? this.fuelType : ''),
            bodyType: (this.bodyType ? this.bodyType : ''),
            minPrice: (this.minPrice ? this.minPrice : ''),
            maxPrice: (this.maxPrice ? this.maxPrice : ''),
            color: (this.color ? this.color : '')
        };

        this.carsService.getCarsFiltered(wrapper).then((response) => {
            console.log(response);
            if (response.status === 'DataRetrieved') {
                this.results = response.data;

                for (const r of this.results) {
                    this.carsService.getPictures(r._id).then((resp) => {
                        if (resp.status === 'DataRetrieved') {
                            if (resp.data && resp.data.length > 0) {
                                r.displayPicture = resp.data[0];
                            }
                        }
                    });
                }
            }
        });
    }

    getBrands() {
        this.carsService.getAll('Brands').then((response) => {
            if (response.status === 'DataRetrieved') {
                this.allBrands = response.data;
                console.log(response)
            }
        });
    }

    getFuelTypes() {
        this.carsService.getAll('FuelTypes').then((response) => {
            if (response.status === 'DataRetrieved') {
                this.allFuelTypes = response.data;
            }
        });
    }

    getBodyTypes() {
        this.carsService.getAll('BodyTypes').then((response) => {
            if (response.status === 'DataRetrieved') {
                this.allBodyTypes = response.data;
            }
        });
    }

    getColors() {
        this.carsService.getAll('Colors').then((response) => {
            if (response.status === 'DataRetrieved') {
                this.allColors = response.data;
            }
        });
    }
}
