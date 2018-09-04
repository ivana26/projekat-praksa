import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICity } from 'app/shared/model/city.model';
import { Principal } from 'app/core';
import { CityService } from './city.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-city',
    templateUrl: './city.component.html'
})
export class CityComponent implements OnInit, OnDestroy {
    cities: ICity[];
    currentAccount: any;
    eventSubscriber: Subscription;
    data: LocalDataSource;
    settings = {
        mode: 'external',
        actions: {
            edit: false,
            delete: false,
            custom: [
                {
                    name: 'View',
                    title: 'View  '
                },
                {
                    name: 'Edit',
                    title: 'Edit  '
                },
                {
                    name: 'Delete',
                    title: 'Delete'
                }
            ]
        },
        add: {
            addButtonContent: 'Add new Article'
        },
        columns: {
            id: {
                title: 'ID'
            },
            name: {
                title: 'Name'
            },
            zipCode: {
                title: 'Zip Code'
            }
        }
    };

    constructor(
        private cityService: CityService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.cityService.query().subscribe(
            (res: HttpResponse<ICity[]>) => {
                this.cities = res.body;
                this.data = new LocalDataSource(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCities();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICity) {
        return item.id;
    }

    registerChangeInCities() {
        this.eventSubscriber = this.eventManager.subscribe('cityListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    addNew() {
        this.router.navigate(['/city/new']);
    }
    myView(event) {
        if (event.action === 'View') {
            this.router.navigate(['city/' + event.data.id + '/view']);
        }
        if (event.action === 'Edit') {
            this.router.navigate(['city/' + event.data.id + '/edit']);
        }
        if (event.action === 'Delete') {
            this.router.navigate(['/', { outlets: { popup: 'city/' + event.data.id + '/delete' } }]);
        }
    }
}
