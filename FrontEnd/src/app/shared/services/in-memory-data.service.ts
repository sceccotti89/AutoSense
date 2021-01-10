import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const fleet: Car[] = [{
      id: '1cba0811-dc5d-4e6b-9b16-8b41c0129c26',
      name: 'Executive car 1',
      vin: 'ASD423E3D3RF5',
      make: 'Mazda',
      model: 'CX-5',
      year: 2019,
      fuelType: 'petrol',
      type: 'SUV',
      position: {
        lat: 3.995,
        lon: 43.2221
      },
      odometer: 43546,
      fuel: 33.4,
      battery: 12.7
    }, {
      id: '2cba0800-dc5d-4e6b-9b16-8b41c0129c26',
      name: 'Executive car 2',
      vin: 'ASD423E3D3RF5',
      make: 'Mazda',
      model: 'CX-5',
      year: 2019,
      fuelType: 'petrol',
      type: 'SUV',
      position: {
        lat: 3.995,
        lon: 43.2221
      },
      odometer: 43546,
      fuel: 33.4,
      battery: 12.7
    }, {
      id: '3cba0811-dc5d-4e6b-9b16-8b41c0129c26',
      name: 'Executive car 3',
      vin: 'ASD423E3D3RF5',
      make: 'Mazda',
      model: 'CX-5',
      year: 2019,
      fuelType: 'petrol',
      type: 'SUV',
      position: {
        lat: 3.995,
        lon: 43.2221
      },
      odometer: 43546,
      fuel: 33.4,
      battery: 12.7
    }];

    return {
      'get-all-fleet': { message: fleet },
      'get-car-fleet': { message: fleet[0] }
    };
  }
}