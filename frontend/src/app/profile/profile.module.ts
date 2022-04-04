import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileService } from './profile.service';
import { AccessService } from '../access/access.service';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfileComponent } from './profile/profile.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        ImageCropperModule,
        CalendarModule,
        RadioButtonModule
    ],
    declarations: [EditProfileComponent, ProfileComponent],
    providers: [ProfileService, AccessService]
})
export class ProfileModule { }
