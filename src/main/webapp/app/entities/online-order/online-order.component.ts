import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOnlineOrder, OnlineOrder } from 'app/shared/model/online-order.model';
import { Principal } from 'app/core';
import { OnlineOrderService } from './online-order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'jhi-online-order',
    templateUrl: './online-order.component.html'
})
export class OnlineOrderComponent implements OnInit, OnDestroy {
    onlineOrders: IOnlineOrder[];
    currentAccount: any;
    eventSubscriber: Subscription;
    data: LocalDataSource;
    url: String = this.router.url;
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
            addButtonContent: 'Add new online-order'
        },
        columns: {
            id: {
                title: 'ID'
            },
            address: {
                title: 'Address'
            },
            phoneNumber: {
                title: 'Phone Number'
            },
            totalPrice: {
                title: 'Total Price'
            },
            orderCity: {
                title: 'City'
            },
            orderClient: {
                title: 'Client'
            }
        }
    };
    constructor(
        private onlineOrderService: OnlineOrderService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    loadAll() {
        this.onlineOrderService.query().subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                this.onlineOrders = res.body;
                this.data = new LocalDataSource();
                for (const onlineOrder of res.body) {
                    if (onlineOrder.totalPrice === null) {
                        onlineOrder.orderCity = onlineOrder.city.name;
                        onlineOrder.orderClient = onlineOrder.client.name;
                        onlineOrder.totalPrice = 0;
                        this.data.add(onlineOrder);
                    } else {
                        onlineOrder.orderCity = onlineOrder.city.name;
                        onlineOrder.orderClient = onlineOrder.client.name;
                        this.data.add(onlineOrder);
                    }
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
        this.registerChangeInOnlineOrders();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOnlineOrder) {
        return item.id;
    }

    registerChangeInOnlineOrders() {
        this.eventSubscriber = this.eventManager.subscribe('onlineOrderListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    addNew(event) {
        this.router.navigate(['/online-order/new']);
    }
    myView(event) {
        if (event.action === 'View') {
            this.router.navigate(['online-order/' + event.data.id + '/view']);
        }
        if (event.action === 'Edit') {
            this.router.navigate(['online-order/' + event.data.id + '/edit']);
        }
        if (event.action === 'Delete') {
            this.router.navigate(['/', { outlets: { popup: 'online-order/' + event.data.id + '/delete' } }]);
        }
    }
}
