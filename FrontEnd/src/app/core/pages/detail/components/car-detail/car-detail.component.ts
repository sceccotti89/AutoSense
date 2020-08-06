import { Component, Input } from '@angular/core';
import { Car } from 'src/app/shared/models/car.model';

@Component({
    selector: 'app-car-detail',
    templateUrl: './car-detail.component.html',
    styleUrls: [ './car-detail.component.scss' ]
})
export class CarDetailComponent {
    @Input() selectedCar: Car;

    constructor() {}
}
