import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProba } from 'app/shared/model/proba.model';

type EntityResponseType = HttpResponse<IProba>;
type EntityArrayResponseType = HttpResponse<IProba[]>;

@Injectable({ providedIn: 'root' })
export class ProbaService {
    private resourceUrl = SERVER_API_URL + 'api/probas';

    constructor(private http: HttpClient) {}

    create(proba: IProba): Observable<EntityResponseType> {
        return this.http.post<IProba>(this.resourceUrl, proba, { observe: 'response' });
    }

    update(proba: IProba): Observable<EntityResponseType> {
        return this.http.put<IProba>(this.resourceUrl, proba, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProba>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProba[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
