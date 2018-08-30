import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProba } from 'app/shared/model/proba.model';

@Component({
    selector: 'jhi-proba-detail',
    templateUrl: './proba-detail.component.html'
})
export class ProbaDetailComponent implements OnInit {
    proba: IProba;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ proba }) => {
            this.proba = proba;
        });
    }

    previousState() {
        window.history.back();
    }
}
