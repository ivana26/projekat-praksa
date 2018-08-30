import { IArticle } from 'app/shared/model//article.model';

export interface IProba {
    id?: number;
    ime?: string;
    lala?: number;
    article?: IArticle;
}

export class Proba implements IProba {
    constructor(public id?: number, public ime?: string, public lala?: number, public article?: IArticle) {}
}
