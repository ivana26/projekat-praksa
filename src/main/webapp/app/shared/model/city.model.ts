export interface ICity {
    id?: number;
    name?: string;
    zipCode?: number;
}

export class City implements ICity {
    constructor(public id?: number, public name?: string, public zipCode?: number) {}
}
