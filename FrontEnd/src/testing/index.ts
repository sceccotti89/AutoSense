import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture } from '@angular/core/testing';

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
    left:  { button: 0 },
    right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
    if (el instanceof HTMLElement) {
        el.click();
    } else {
        el.triggerEventHandler('click', eventObj);
    }
}

export function checkNavigateByUrl(fixture: ComponentFixture<any>, urlToVerify: string): void {
    const router = fixture.debugElement.injector.get(Router);
    const spy = router.navigateByUrl as jasmine.Spy;
    const url = spy.calls.first().args[0];
    expect(url).toBe(urlToVerify);
}
