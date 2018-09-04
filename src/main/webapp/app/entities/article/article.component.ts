import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, OnDestroy, LOCALE_ID } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IArticle } from 'app/shared/model/article.model';
import { Principal } from 'app/core';
import { ArticleService } from './article.service';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-article',
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit, OnDestroy {
    articles: IArticle[];
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
                title: 'ID',
                editable: false
            },
            name: {
                title: 'Name'
            },
            articleNumber: {
                title: 'Article Number'
            },
            price: {
                title: 'Price'
            },
            availableAmount: {
                title: 'Available Amount'
            },
            articleType: {
                title: 'Types'
            }
        }
    };

    constructor(
        private articleService: ArticleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
                this.data = new LocalDataSource();
                for (const article of res.body) {
                    if (article.type != null) {
                        article.articleType = article.type.name;
                        this.data.add(article);
                    } else {
                        article.articleType = ' ';
                        this.data.add(article);
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
        this.registerChangeInArticles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IArticle) {
        return item.id;
    }

    registerChangeInArticles() {
        this.eventSubscriber = this.eventManager.subscribe('articleListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    addNew() {
        this.router.navigate(['/article/new']);
    }
    myView(event) {
        if (event.action === 'View') {
            this.router.navigate(['article/' + event.data.id + '/view']);
        }
        if (event.action === 'Edit') {
            this.router.navigate(['article/' + event.data.id + '/edit']);
        }
        if (event.action === 'Delete') {
            this.router.navigate(['/', { outlets: { popup: 'article/' + event.data.id + '/delete' } }]);
        }
    }
}
