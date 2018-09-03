import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEmployee } from 'app/shared/model/employee.model';
import { Principal } from 'app/core';
import { EmployeeService } from './employee.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@Component({
    selector: 'jhi-employee',
    templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit, OnDestroy {
    employees: IEmployee[];
    currentAccount: any;
    eventSubscriber: Subscription;
    settings = {
        columns: {
            id: {
                title: 'ID'
            },
            name: {
                title: 'Full Name'
            },
            username: {
                title: 'User Name'
            },
            email: {
                title: 'Email'
            }
        }
    };
    data = [
        {
            id: 1,
            name: 'Leanne Graham',
            username: 'Bret',
            email: 'Sincere@april.biz'
        },
        {
            id: 2,
            name: 'Ervin Howell',
            username: 'Antonette',
            email: 'Shanna@melissa.tv'
        },

        // ... list of items

        {
            id: 11,
            name: 'Nicholas DuBuque',
            username: 'Nicholas.Stanton',
            email: 'Rey.Padberg@rosamond.biz'
        }
    ];

    constructor(
        private employeeService: EmployeeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.employeeService.query().subscribe(
            (res: HttpResponse<IEmployee[]>) => {
                this.employees = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInEmployees();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IEmployee) {
        return item.id;
    }

    registerChangeInEmployees() {
        this.eventSubscriber = this.eventManager.subscribe('employeeListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
