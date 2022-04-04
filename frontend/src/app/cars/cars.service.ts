import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CarsService {

    rootURL = 'http://localhost:1234/cars/';
    addCarURL = this.rootURL + 'add';
    deleteCarURL = this.rootURL + 'delete';
    getCarURL = this.rootURL + 'getCarById';
    getCarsByUserIdURL = this.rootURL + 'getCarsByUserId';
    getCarsFilteredURL = this.rootURL + 'getFiltered';
    uploadPicturesURL = this.rootURL + 'uploadPictures';
    getPictureURL = this.rootURL + 'getPicture';
    getPicturesURL = this.rootURL + 'getPictures';
    deletePictureURL = this.rootURL + 'deletePicture';

    dictionayURLS = {
        getBrandsURL: this.rootURL + 'getAllBrands',
        getModelsURL: this.rootURL + 'getAllModels',
        getColorsURL: this.rootURL + 'getAllColors',
        getFeaturesURL: this.rootURL + 'getAllFeatures',
        getCarCountriesURL: this.rootURL + 'getAllCarCountries',
        getFuelTypesURL: this.rootURL + 'getAllFuelTypes',
        getBodyTypesURL: this.rootURL + 'getAllBodyTypes'
    };

    constructor(private http: HttpClient) { }

    addCar(wrapper) {
        return new Promise<any>(resolve => {
            this.http.post(this.addCarURL, wrapper)
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    getCar(id) {
        return new Promise<any>(resolve => {
            this.http.get(this.getCarURL, { params: { id: id } })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    deleteCar(id) {
        return new Promise<any>(resolve => {
            this.http.delete(this.deleteCarURL, { params: { id: id } })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    uploadFiles(files) {
        return new Promise<any>(resolve => {
            this.http.post(this.uploadPicturesURL, files)
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    getPictures(listingId) {
        return new Promise<any>(resolve => {
            this.http.get(this.getPicturesURL, { params: { listingId: listingId } })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    deletePicture(name) {
        return new Promise<any>(resolve => {
            this.http.delete(this.deletePictureURL, { params: { fileName: name } })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    getCarsByUserId() {
        return new Promise<any>(resolve => {
            this.http.get(this.getCarsByUserIdURL)
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    getAll(item) {
        const url = this.rootURL + 'getAll' + item;
        return new Promise<any>(resolve => {
            this.http.get(url)
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    getCarsFiltered(wrapper) {
        return new Promise<any>(resolve => {
            this.http.get(this.getCarsFilteredURL, { params: wrapper })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }
}
