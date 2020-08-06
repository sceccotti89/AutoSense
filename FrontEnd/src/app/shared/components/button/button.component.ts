import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: [ './button.component.scss' ]
})
export class ButtonComponent {
    @Input() id = 'btn';
    @Input() text: string;
    @Input() disabled = false;
    @Input() type = 'button';
    @Output() clickEvent: EventEmitter<void>;

    constructor() {
        this.clickEvent = new EventEmitter<void>();
    }

    public emitEvent(): void {
        this.clickEvent.emit();
    }
}
