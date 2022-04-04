import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    profileID;
    profileData: any = {};
    myEvents = [];

    constructor(private profileService: ProfileService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.profileID = this.route.snapshot.paramMap.get('id');
        this.profileData.picture = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

        this.getProfile();
        this.getFriends();
    }

    getProfile() {
        this.profileService.getProfile(this.profileID)
            .then((response) => {
                if (response.status === 'DataRetrieved') {
                    this.profileData = response.data;
                } else {
                    //
                }
            });
    }

    getFriends() {
        this.profileService.getFriends(this.profileID)
            .then((response) => {
                console.log(response);
                this.myEvents = response.data;
            });
    }

}
