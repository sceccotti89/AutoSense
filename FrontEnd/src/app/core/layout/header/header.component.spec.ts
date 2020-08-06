import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { click, checkNavigateByUrl } from 'src/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async(() => {
        const routerSpy = jasmine.createSpyObj('Router', [ 'navigateByUrl' ]);

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                HeaderComponent
            ],
            providers: [
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
    }));

    it('should create the component', () => {
        const header = fixture.debugElement.componentInstance;
        expect(header).toBeDefined();
    });

    it('should navigate to the home page after clicking the logo', () => {
        const headerDe: DebugElement = fixture.debugElement;
        const logoDe = headerDe.query(By.css('a'));
        click(logoDe.nativeElement);

        checkNavigateByUrl(fixture, '/');
    });
});
