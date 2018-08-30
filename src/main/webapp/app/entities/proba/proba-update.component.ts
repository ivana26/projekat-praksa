import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IProba } from 'app/shared/model/proba.model';
import { ProbaService } from './proba.service';
import { IArticle } from 'app/shared/model/article.model';
import { ArticleService } from 'app/entities/article';

@Component({
    selector: 'jhi-proba-update',
    templateUrl: './proba-update.component.html'
})
export class ProbaUpdateComponent implements OnInit {
    private _proba: IProba;
    isSaving: boolean;

    articles: IArticle[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private probaService: ProbaService,
        private articleService: ArticleService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ proba }) => {
            this.proba = proba;
        });
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
        if (this.proba.id !== undefined) {
            this.subscribeToSaveResponse(this.probaService.update(this.proba));
        } else {
            this.subscribeToSaveResponse(this.probaService.create(this.proba));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IProba>>) {
        result.subscribe((res: HttpResponse<IProba>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackArticleById(index: number, item: IArticle) {
        return item.id;
    }
    get proba() {
        return this._proba;
    }

    set proba(proba: IProba) {
        this._proba = proba;
    }
}
