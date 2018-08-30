export interface IEmployee {
    id?: number;
    name?: string;
    department?: string;
}

export class Employee implements IEmployee {
    constructor(public id?: number, public name?: string, public department?: string) {}
}
