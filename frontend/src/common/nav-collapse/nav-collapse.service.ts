import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavCollapseService {

    private source =  new BehaviorSubject<any>(0);
    sourceObs = this.source.asObservable();

    constructor() { }

    updateStatus(status: any) {
        this.source.next(status);
    }
}
