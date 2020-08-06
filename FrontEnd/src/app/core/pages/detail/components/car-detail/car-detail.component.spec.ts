import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { Car } from 'src/app/shared/models/car.model';
import { CarDetailComponent } from './car-detail.component';
import { DetailModule } from '../../detail.module';

describe('DetailComponent', () => {
    let fixture: ComponentFixture<CarDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                DetailModule
            ],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(CarDetailComponent);
    }));

    it('should create the component', () => {
        const detail = fixture.debugElement.componentInstance;
        expect(detail).toBeDefined();
    });

    it('should display the car details', () => {
        const car: Car = createCar();
        fixture.componentInstance.selectedCar = car;

        fixture.detectChanges();

        Object.keys(car).map((key) => {
            if (key !== 'id' && key !== 'position') {
                expect(getComponentValue(fixture, `#${key}`)).toEqual('' + car[key]);
            }
        });
    });
});

const getComponentValue = (fixture: ComponentFixture<CarDetailComponent>, query: string) => {
    return fixture.debugElement.nativeElement.querySelector(query).innerHTML;
};

const createCar = (): Car => {
    return {
        id: 'id',
        name: 'name',
        make: 'make' ,
        model: 'model',
        battery: 10,
        fuel: 10,
        fuelType: 'fuelType',
        odometer: 0,
        position: { lat: 10, lon: 10 },
        type: 'type',
        vin: 'vin',
        year: 2000
    };
};
