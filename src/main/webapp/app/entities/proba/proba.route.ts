import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Proba } from 'app/shared/model/proba.model';
import { ProbaService } from './proba.service';
import { ProbaComponent } from './proba.component';
import { ProbaDetailComponent } from './proba-detail.component';
import { ProbaUpdateComponent } from './proba-update.component';
import { ProbaDeletePopupComponent } from './proba-delete-dialog.component';
import { IProba } from 'app/shared/model/proba.model';

@Injectable({ providedIn: 'root' })
export class ProbaResolve implements Resolve<IProba> {
    constructor(private service: ProbaService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((proba: HttpResponse<Proba>) => proba.body));
        }
        return of(new Proba());
    }
}

export const probaRoute: Routes = [
    {
        path: 'proba',
        component: ProbaComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.proba.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'proba/:id/view',
        component: ProbaDetailComponent,
        resolve: {
            proba: ProbaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.proba.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'proba/new',
        component: ProbaUpdateComponent,
        resolve: {
            proba: ProbaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.proba.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'proba/:id/edit',
        component: ProbaUpdateComponent,
        resolve: {
            proba: ProbaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.proba.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const probaPopupRoute: Routes = [
    {
        path: 'proba/:id/delete',
        component: ProbaDeletePopupComponent,
        resolve: {
            proba: ProbaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.proba.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
