import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { click, checkNavigateByUrl } from 'src/testing';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { ToastrService } from 'ngx-toastr';
import { FleetService } from 'src/app/shared/services/fleet.service';
import { HomeModule } from './home.module';
import { of, throwError } from 'rxjs';
import { Car } from 'src/app/shared/models/car.model';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let fleetSpy: any;
    let toastrSpy: any;

    beforeEach(async(() => {
        const routerSpy = jasmine.createSpyObj('Router', [ 'navigateByUrl' ]);
        toastrSpy       = jasmine.createSpyObj('Toaster', [ 'success', 'error' ]);
        fleetSpy        = jasmine.createSpyObj('FleetService', [ 'getFleet' ]);

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HomeModule
            ],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ToastrService, useValue: toastrSpy },
                { provide: FleetService, useValue: fleetSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
    }));

    it('should create the component', () => {
        const home = fixture.debugElement.componentInstance;
        expect(home).toBeDefined();
        expect(home.loading).toBeFalsy();
    });

    it('should ask for the fleet getting an empty list', () => {
        const getFleetSpy = fleetSpy.getFleet.and.returnValue(of({ message: [] }));

        // Necessary for the onInit().
        fixture.detectChanges();

        expect(getFleetSpy.calls.any()).toBe(true, 'getFleet called');

        const home = fixture.debugElement.componentInstance;
        expect(home.loading).toBeFalsy();

        // Check we are showing text instead of table.
        const div: HTMLElement = fixture.debugElement.query(By.css('#no-fleet-message')).nativeElement;
        expect(div.innerHTML).toContain(home.textMessage);
    });

    it('should ask for the fleet getting a list of cars', () => {
        const fleetLength = 5;
        const getFleetSpy = fleetSpy.getFleet.and.returnValue(of({ message: createFleet(fleetLength) }));

        // Necessary for the onInit().
        fixture.detectChanges();

        expect(getFleetSpy.calls.any()).toBe(true, 'getFleet called');

        const home = fixture.debugElement.componentInstance;
        expect(home.loading).toBeFalsy();

        // Check we are showing the table with the correct number of rows and content.
        const tableRows = fixture.nativeElement.querySelectorAll('.car-row');
        expect(tableRows.length).toBe(fleetLength);

        for (let i = 0; i < tableRows.length; i++) {
            checkTableRow(tableRows[i], i + 1);
        }
    });

    it('should ask for the fleet getting an error response', () => {
        const mockErrorResponse = 'Retrieval error';
        const getFleetSpy = fleetSpy.getFleet.and.returnValue(throwError(mockErrorResponse));

        const toastr = fixture.debugElement.injector.get(ToastrService);

        // Necessary for the onInit().
        fixture.detectChanges();

        expect(getFleetSpy.calls.any()).toBe(true, 'getFleet called');

        const spy = toastr.error as jasmine.Spy;
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.first().args[0]).toEqual(`"${mockErrorResponse}"`);

        const home = fixture.debugElement.componentInstance;
        expect(home.loading).toBeFalsy();

        // Check we are showing the table with the correct number of rows and content.
        const div: HTMLElement = fixture.debugElement.query(By.css('#no-fleet-message')).nativeElement;
        expect(div.innerHTML).toContain(home.textMessage);
    });

    it('should ask for the fleet and navigate to the correct page when clicking on a row', () => {
        const fleetLength = 5;
        const getFleetSpy = fleetSpy.getFleet.and.returnValue(of({ message: createFleet(fleetLength) }));

        // Necessary for the onInit().
        fixture.detectChanges();

        expect(getFleetSpy.calls.any()).toBe(true, 'getFleet called');

        const home = fixture.debugElement.componentInstance;
        expect(home.loading).toBeFalsy();

        // Check click on a specific row.
        const rowIndex = 2;
        const rowDebug = fixture.debugElement.query(By.css(`.car-row:nth-child(${rowIndex})`));
        click(rowDebug.nativeElement);

        checkNavigateByUrl(fixture, `/${home.fleet[rowIndex - 1].id}`);
    });
});

const checkTableRow = (tableRow: any, index: number) => {
    expect(tableRow.cells[0].innerHTML).toBe('name_'  + index);
    expect(tableRow.cells[1].innerHTML).toBe('make_'  + index);
    expect(tableRow.cells[2].innerHTML).toBe('model_' + index);
};

const createFleet = (n: number): Partial<Car>[] => {
    return Array(n).fill(0).map((_, index) => ({
        id:    'id_'    + (index + 1),
        name:  'name_'  + (index + 1),
        make:  'make_'  + (index + 1),
        model: 'model_' + (index + 1)
    }));
};

// const waitUntil = async (untilTruthy: Function): Promise<boolean> => {
//     while (!untilTruthy()) {
//       await interval(25).pipe(take(1)).toPromise();
//     }
//     return Promise.resolve(true);
// };
