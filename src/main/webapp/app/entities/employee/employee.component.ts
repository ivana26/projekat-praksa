import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEmployee } from 'app/shared/model/employee.model';
import { Principal } from 'app/core';
import { EmployeeService } from './employee.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
@Component({
    selector: 'jhi-employee',
    templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit, OnDestroy {
    employees: IEmployee[];
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
            addButtonContent: 'Add new Employee'
        },
        columns: {
            id: {
                title: 'ID'
            },
            firstLast: {
                title: 'Name and Surname'
            },
            // firstName : {
            //     title: 'First Name'
            // },
            // lastName : {
            //     title: 'Last Name'
            // },
            position: {
                title: 'Position',
                valuePrepareFunction: position => position.name
            }
        }
    };

    constructor(
        private employeeService: EmployeeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.employeeService.query().subscribe(
            (res: HttpResponse<IEmployee[]>) => {
                this.employees = res.body;
                this.data = new LocalDataSource();
                for (const name of res.body) {
                    name.firstLast = name.firstName + ' ' + name.lastName;
                    this.data.add(name);
                }
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
    addNew() {
        this.router.navigate(['/employee/new']);
    }
    myView(event) {
        if (event.action === 'View') {
            this.router.navigate(['employee/' + event.data.id + '/view']);
        }
        if (event.action === 'Edit') {
            this.router.navigate(['employee/' + event.data.id + '/edit']);
        }
        if (event.action === 'Delete') {
            this.router.navigate(['/', { outlets: { popup: 'employee/' + event.data.id + '/delete' } }]);
        }
    }
}
