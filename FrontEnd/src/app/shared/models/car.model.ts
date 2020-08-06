export class Car {
    id: string;
    name: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    fuelType: string;
    type: string;
    position: {
        lat: number;
        lon: number;
    };
    odometer: number;
    fuel: number;
    battery: number;

    constructor() {
        this.position = {
            lat: undefined,
            lon: undefined
        };
    }
}
