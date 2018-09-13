import { onlineOrderRoute } from './../online-order/online-order.route';
import { Article } from './../../shared/model/article.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { OnlineOrderItemService } from './online-order-item.service';
import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { OnlineOrderService } from 'app/entities/online-order';
import { IArticle } from 'app/shared/model/article.model';
import { ArticleService } from 'app/entities/article';

@Component({
    selector: 'jhi-online-order-item-update',
    templateUrl: './online-order-item-update.component.html'
})
export class OnlineOrderItemUpdateComponent implements OnInit {
    private _onlineOrderItem: IOnlineOrderItem;
    isSaving: boolean;
    onlineorders: IOnlineOrder[];
    articles: IArticle[];
    idd = 0;

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderItemService: OnlineOrderItemService,
        private onlineOrderService: OnlineOrderService,
        private articleService: ArticleService,
        private activatedRoute: ActivatedRoute,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ onlineOrderItem }) => {
            this.onlineOrderItem = onlineOrderItem;
        });
        this.onlineOrderService.query().subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                this.onlineorders = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        // izvadila iz route itemorder
        this.route.params.subscribe(params => {
            this.idd = +params['itemOrder'];
        });
        // pronasla taj route preko idd i sacuvala u onlineOrder
        this.onlineOrderService.find(this.idd).subscribe(
            (res: HttpResponse<IOnlineOrder>) => {
                this.onlineOrderItem.onlineOrder = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.onlineOrderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.onlineOrderItemService.update(this.onlineOrderItem));
        } else {
            this.subscribeToSaveResponse(this.onlineOrderItemService.create(this.onlineOrderItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOnlineOrderItem>>) {
        result.subscribe(
            (res: HttpResponse<IOnlineOrderItem>) => this.onSaveSuccess(event),
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    private onSaveSuccess(event) {
        this.isSaving = false;
        // this.previousState();
        this.router.navigate(['online-order/' + this.idd + '/edit']);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackOnlineOrderById(index: number, item: IOnlineOrder) {
        return item.id;
    }

    trackArticleById(index: number, item: IArticle) {
        return item.id;
    }
    get onlineOrderItem() {
        return this._onlineOrderItem;
    }

    set onlineOrderItem(onlineOrderItem: IOnlineOrderItem) {
        this._onlineOrderItem = onlineOrderItem;
    }

    totalPrice() {
        if (this.onlineOrderItem.onlineArticle.price && this.onlineOrderItem.orderedAmount) {
            this.onlineOrderItem.itemPrice = this.onlineOrderItem.orderedAmount * this.onlineOrderItem.onlineArticle.price;
        }
    }

    next() {
        this.isSaving = true;
        if (this.onlineOrderItem.id !== undefined) {
            this.subscribeToSaveResponseNext(this.onlineOrderItemService.update(this.onlineOrderItem));
        } else {
            this.subscribeToSaveResponseNext(this.onlineOrderItemService.create(this.onlineOrderItem));
        }
    }

    private subscribeToSaveResponseNext(result: Observable<HttpResponse<IOnlineOrderItem>>) {
        result.subscribe((res: HttpResponse<IOnlineOrderItem>) => this.onSaveSuccess1(), (res: HttpErrorResponse) => this.onSaveError1());
    }

    private onSaveSuccess1() {
        this.isSaving = false;
        this.router
            .navigateByUrl('', { skipLocationChange: true })
            .then(() => this.router.navigate(['online-order/' + this.idd + '/online-order-item/new']));
        // this.router.navigate(['online-order/' + this.idd + '/online-order-item/new']);
    }

    private onSaveError1() {
        this.isSaving = false;
    }
}
