import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { DetailModule } from './detail.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FleetService } from 'src/app/shared/services/fleet.service';
import { of } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { Car } from 'src/app/shared/models/car.model';
import { click, checkNavigateByUrl } from 'src/testing';

describe('DetailComponent', () => {
    let fixture: ComponentFixture<DetailComponent>;
    let fleetSpy: any;
    let toastrSpy: any;
    let activatedRouteStub: ActivatedRouteStub;

    beforeEach(async(() => {
        const routerSpy       = jasmine.createSpyObj('Router', [ 'navigateByUrl' ]);
        toastrSpy             = jasmine.createSpyObj('Toaster', [ 'success', 'error' ]);
        fleetSpy              = jasmine.createSpyObj('FleetService', [ 'getCarDetails' ]);
        activatedRouteStub    = new ActivatedRouteStub();

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                DetailModule
            ],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: ToastrService, useValue: toastrSpy },
                { provide: FleetService, useValue: fleetSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DetailComponent);
    }));

    it('should create the component', () => {
        const detail = fixture.debugElement.componentInstance;
        expect(detail).toBeDefined();
        expect(detail.loading).toBeFalsy();
    });

    it('should back to home when clicking to back home button', () => {
        activatedRouteStub.setParamMap({ id: 'test_id' });
        fleetSpy.getCarDetails.and.returnValue(of({ message: createCar() }));

        fixture.detectChanges();

        const buttonDebug = fixture.debugElement.nativeElement.querySelector('#back-to-home-button');
        click(buttonDebug);

        checkNavigateByUrl(fixture, '/');
    });
});

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
