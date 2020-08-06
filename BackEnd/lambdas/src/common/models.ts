export class Response {
    statusCode: number;
    headers: { [header: string]: string | number | boolean; };
    body: string;

    constructor(statusCode: number, message: any) {
        this.statusCode = statusCode;
        this.headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers' : 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': "OPTIONS,POST,GET,DELETE"
        };
        this.body = JSON.stringify({ message }, null, 2);
    }
}

export interface Car {
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
}