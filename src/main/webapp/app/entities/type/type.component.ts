import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IType } from 'app/shared/model/type.model';
import { Principal } from 'app/core';
import { TypeService } from './type.service';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-type',
    templateUrl: './type.component.html'
})
export class TypeComponent implements OnInit, OnDestroy {
    types: IType[];
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
            description: {
                title: 'Description'
            }
        }
    };

    constructor(
        private typeService: TypeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.typeService.query().subscribe(
            (res: HttpResponse<IType[]>) => {
                this.types = res.body;
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
        this.registerChangeInTypes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IType) {
        return item.id;
    }

    registerChangeInTypes() {
        this.eventSubscriber = this.eventManager.subscribe('typeListModification', response => this.loadAll());
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
