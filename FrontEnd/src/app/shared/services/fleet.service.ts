import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Car } from 'src/app/shared/models/car.model';
import { DataResponse } from '../models/common.model';

const getFleetUrl           = `${environment.backEndBaseUrl}/get-all-fleet`;
const getCarFromFleetUrl    = `${environment.backEndBaseUrl}/get-car-fleet`;
const addCarToFleetUrl      = `${environment.backEndBaseUrl}/add-car-fleet`;
const deleteCarFromFleetUrl = `${environment.backEndBaseUrl}/delete-car-fleet`;

@Injectable()
export class FleetService {
    constructor(private httpClient: HttpClient) {}

    public getFleet(): Observable<DataResponse> {
        return this.httpClient.get<DataResponse>(getFleetUrl);
    }

    public getCarDetails(id: string): Observable<DataResponse> {
        return this.httpClient.get<DataResponse>(`${getCarFromFleetUrl}/${id}`);
    }

    public addCarToFleet(data: Car): Observable<DataResponse> {
        return this.httpClient.post<DataResponse>(addCarToFleetUrl, data);
    }

    public deleteCarFromFleet(id: string): Observable<DataResponse> {
        return this.httpClient.delete<DataResponse>(`${deleteCarFromFleetUrl}/${id}`);
    }
}
