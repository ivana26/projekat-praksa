import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { Principal } from 'app/core';
import { OnlineOrderItemService } from './online-order-item.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jhi-online-order-item',
    templateUrl: './online-order-item.component.html'
})
export class OnlineOrderItemComponent implements OnInit, OnDestroy {
    onlineOrderItems: IOnlineOrderItem[];
    currentAccount: any;
    eventSubscriber: Subscription;
    data: LocalDataSource;
    onlineOrderid: number;
    articlePrice: number;
    totalPrice = 0;
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
            addButtonContent: 'Add new online-order item'
        },
        columns: {
            id: {
                title: 'ID'
            },
            orderedAmount: {
                title: 'Ordered Amount'
            },
            itemPrice: {
                title: 'Item Price'
            },
            itemOrder: {
                title: 'Order'
            },
            itemArticle: {
                title: 'Article'
            }
        }
    };
    constructor(
        private onlineOrderItemService: OnlineOrderItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    loadAll() {
        this.onlineOrderItemService.findByOnlineOrderid(this.onlineOrderid).subscribe(
            (res: HttpResponse<IOnlineOrderItem[]>) => {
                this.onlineOrderItems = res.body;
                this.data = new LocalDataSource();
                for (const itemO of res.body) {
                    itemO.itemArticle = itemO.onlineArticle.name;
                    itemO.itemOrder = itemO.onlineArticle.price;
                    itemO.itemPrice = itemO.onlineArticle.price * itemO.orderedAmount;

                    itemO.itemOrder = itemO.onlineOrder.id;
                    this.totalPrice += itemO.itemPrice;
                    console.log(this.totalPrice);
                    this.data.add(itemO);
                }

                this.eventManager.broadcast({
                    name: 'onlineOrderTotalPrice',
                    content: this.totalPrice
                });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.onlineOrderid = +params['id'];
            console.log(this.onlineOrderid + 'ONLINEORDERID');
            this.loadAll();
        });

        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInOnlineOrderItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOnlineOrderItem) {
        return item.id;
    }

    registerChangeInOnlineOrderItems() {
        this.eventSubscriber = this.eventManager.subscribe('onlineOrderItemListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    addNew() {
        this.eventManager.broadcast({
            name: 'saveOnlineOrder',
            content: ''
        });
        setTimeout(() => this.router.navigate(['/online-order-item/new']), 100);
    }
    myView(event) {
        if (event.action === 'View') {
            this.eventManager.broadcast({
                name: 'saveOnlineOrder',
                content: ''
            });
            setTimeout(() => this.router.navigate(['online-order-item/' + event.data.id + '/view']), 100);
        }
        if (event.action === 'Edit') {
            this.eventManager.broadcast({
                name: 'saveOnlineOrder',
                content: ''
            });
            setTimeout(() => this.router.navigate(['online-order-item/' + event.data.id + '/edit']), 100);
        }
        if (event.action === 'Delete') {
            this.router.navigate(['/', { outlets: { popup: 'online-order-item/' + event.data.id + '/delete' } }]);
        }
    }
}
