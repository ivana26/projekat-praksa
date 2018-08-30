export interface ICity {
    id?: number;
    name?: string;
    postalCode?: number;
    zipCode?: number;
}

export class City implements ICity {
    constructor(public id?: number, public name?: string, public postalCode?: number, public zipCode?: number) {}
}
