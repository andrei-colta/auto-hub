import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { ViewComponent } from './view/view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddComponent } from './add/add.component';
import { CarsService } from './cars.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MyListingsComponent } from './my-listings/my-listings.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        ImageCropperModule
    ],
    declarations: [SearchComponent, ViewComponent, AddComponent, MyListingsComponent],
    providers: [CarsService]
})
export class CarsModule { }
