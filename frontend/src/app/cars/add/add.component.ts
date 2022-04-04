import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarsService } from '../cars.service';
import { HttpParams, HttpRequest, HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

    allYears = [];
    year;

    @ViewChild('fileInput') file;

    files: Set<File> = new Set();
    selectedPic;
    picsToDelete = [];

    allFeatures;
    features = [];

    allBrands;
    maker;
    carCountries;

    allModels;
    model;

    allColors;
    color;

    fuelType;
    allFuelTypes;

    bodyType;
    allBodyTypes;

    mileage;
    engineSize;
    power;

    price;
    description;

    listingId;
    onEdit = false;

    myPictures = [];

    showAlert;
    alertText;
    alertType;

    constructor(private route: ActivatedRoute, private carsService: CarsService, private router: Router, private http: HttpClient) { }

    ngOnInit() {
        this.listingId = this.route.snapshot.paramMap.get('id');

        if (this.listingId) {
            this.onEdit = true;

            this.getCar();
            this.getPictures();
        }

        this.getBrands();
        this.getColors();
        this.getBodyTypes();
        this.getFuelTypes();
        this.getFeatures();
        this.getCarCountries();

        for (let y = 2019; y > 1990; y--) {
            this.allYears.push({ value: y, label: y.toString() });
        }
    }

    addFiles(event) {
        this.files = new Set();
        const files = event.target.files;
        for (const file of files) {
            this.files.add(file);
        }
        const url = this.carsService.uploadPicturesURL;
        const formDataArray = [];
        this.files.forEach((file) => {
            const formData: FormData = new FormData();
            formData.append('picture', file, file.name);

            const params = new HttpParams().append('listingId', this.listingId);

            const req = new HttpRequest('POST', url, formData, {
                params: params
            });

            this.http.request(req).subscribe((response: any) => {
                if (response.body) {
                    this.myPictures.push(response.body);
                }
            });
        });
    }

    deletePicture(pic) {
        this.picsToDelete.push(pic.name);
        this.myPictures.splice(this.myPictures.indexOf(pic), 1);
    }

    revertChanges() {
        this.getCar();
        this.getPictures();
    }

    getPictures() {
        this.carsService.getPictures(this.listingId).then((response) => {
            if (response.status === 'DataRetrieved') {
                this.myPictures = response.data;
            }
        });
    }

    getCar() {
        this.carsService.getCar(this.listingId).then((response) => {
            console.log(response);
            if (response.status === 'DataRetrieved') {
                const data = response.data;
                this.bodyType = data.bodyType;
                this.engineSize = data.engineSize;
                this.maker = data.maker;
                this.getModels();

                this.model = data.model;
                this.power = data.power;
                this.description = data.description;
                this.price = data.price;
                this.mileage = data.mileage;
                this.fuelType = data.fuelType;
                this.features = data.features;
                this.year = data.year;
                this.color = data.color;
            }
        });
    }

    getModels() {
        if (this.maker === 'BMW') {
            // this.allModels = this.bmwModels;
        }
    }

    checkForm() {
        if (!this.maker
            || (this.allModels && !this.model)
            || !this.color
            || !this.fuelType
            || !this.bodyType
            || !this.mileage
            || !this.engineSize
            || !this.power
            || !this.price
            || !this.description
            || !this.year) {
            return false;
        }

        return true;
    }

    addListing() {
        if (!this.checkForm()) {
            this.showAlert = true;
            this.alertText = 'Please complete all fields!';
            this.alertType = 'danger';

            setTimeout(() => {
                this.showAlert = false;
            }, 2000);
            return;
        }
        const wrapper = {
            _id: (this.listingId ? this.listingId : null),
            maker: this.maker,
            model: this.model,
            color: this.color,
            fuelType: this.fuelType,
            bodyType: this.bodyType,
            mileage: this.mileage,
            engineSize: this.engineSize,
            power: this.power,
            price: this.price,
            description: this.description,
            features: this.features,
            year: this.year,
            picsToDelete: this.picsToDelete
        };

        this.carsService.addCar(wrapper).then((response) => {
            console.log(response)
            if (response.status === 'DataInserted') {
                this.showAlert = true;
                this.alertText = 'Listing added successfully!';
                this.alertType = 'success';

                setTimeout(() => {
                    this.showAlert = false;
                }, 2000);

                if (!this.onEdit) {
                    const route = '/addListing/' + response.id;
                    this.router.navigateByUrl('/', { skipLocationChange: true })
                        .then(() => {
                            this.router.navigate([route]);
                        });
                } else {
                    this.getCar();
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

    getFeatures() {
        this.carsService.getAll('Features').then((response) => {
            if (response.status === 'DataRetrieved') {
                console.log(response)
                this.allFeatures = response.data;
            }
        });
    }

    getCarCountries() {
        this.carsService.getAll('CarCountries').then((response) => {
            if (response.status === 'DataRetrieved') {
                console.log(response)
                this.carCountries = response.data;
            }
        });
    }

    getCountry(countryName) {
        for (const c of this.carCountries) {
            if (c.name === countryName) {
                return c;
            }
        }
    }
}
