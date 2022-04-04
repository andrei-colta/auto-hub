// import { TranslateService } from '@ngx-translate/core';

import { Component, OnInit, HostListener, ElementRef, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
// import { ScrollingModule } from '@angular/cdk/scrolling';
import { AccessService } from 'src/app/access/access.service';
import { NavCollapseService } from '../nav-collapse/nav-collapse.service';
import { Router } from '@angular/router';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    @ViewChild('scrollTopBut') scrollTopBut: ElementRef;
    @ViewChild('navWrap') navWrap: ElementRef;
    @Output('navtog') navtog = new EventEmitter();

    isNavbarCollapsed = true;
    lastKnownScroll: number = window.scrollY;
    scrollingDown = false;
    showFlag = false;
    scrollPadding: boolean;
    isLogged: boolean;

    picture;
    firstName;
    id;
    type;
    email;

    constructor(private renderer: Renderer2, private accessService: AccessService, private router: Router,
        private navService: NavCollapseService) { }

    ngOnInit() {
        this.isLogged = (localStorage.getItem('user_id') !== null);
        if (this.isLogged) {
            this.picture = localStorage.getItem('picture');
            this.firstName = (localStorage.getItem('firstName') ? localStorage.getItem('firstName') : '');
            this.id = localStorage.getItem('user_id');
            this.email = localStorage.getItem('email');
        }

        this.accessService.loggedObservable.subscribe((isLogged) => {
            console.log(isLogged);
            this.isLogged = isLogged;

            if (isLogged) {
                this.picture = localStorage.getItem('picture');
                this.id = localStorage.getItem('user_id');
                this.email = localStorage.getItem('email');
                this.firstName = (localStorage.getItem('firstName') ? localStorage.getItem('firstName') : '');
            }
        });
    }

    // listener for window scroll events
    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        this.scrollingDown = window.scrollY > this.lastKnownScroll ? true : false;
        this.lastKnownScroll = window.scrollY;
        if (window.scrollY < (this.navWrap.nativeElement.offsetHeight + 10)) {
            this.navtog.emit(this.scrollingDown);
            this.navService.updateStatus(!this.scrollingDown);
        }

        if (window.scrollY > (0.6 * window.innerHeight) && !this.showFlag) {
            this.scrollButtonShow();
        }
    }

    // handler for mouseover events on scroll up button
    hoverHandler() {
        if (window.scrollY > (0.6 * window.innerHeight)) {
            this.scrollButtonShow();
        }
    }

    // method for showing the scroll up button and triggering animation
    scrollButtonShow() {
        if (this.scrollTopBut) {
            this.showFlag = true;
            this.renderer.removeClass(this.scrollTopBut.nativeElement, 'fade-out');
            // this.scrollTopBut.nativeElement.offsetHeight;
            this.renderer.addClass(this.scrollTopBut.nativeElement, 'fade-out');
            setTimeout(() => {
                this.showFlag = false;
            }, 700);
        }
    }

    // method for scrolling to top of page
    scrollToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

    setLang(x) {
        // this.translate.use(x);
    }

}
