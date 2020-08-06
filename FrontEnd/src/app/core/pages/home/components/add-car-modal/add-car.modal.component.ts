import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/shared/models/car.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FleetService } from 'src/app/shared/services/fleet.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-add-car-modal',
    templateUrl: './add-car.modal.component.html',
    styleUrls: ['./add-car.modal.component.scss']
})
export class AddCarModalComponent {
    @Output() addedCarEvent: EventEmitter<void>;

    public modalRef: BsModalRef;
    public carModel: Car;
    public loading: boolean;

    @ViewChild('template', { static: false }) modal: any;

    constructor(private fleetService: FleetService,
                private modalService: BsModalService,
                private toastrService: ToastrService) {
        this.addedCarEvent = new EventEmitter<void>();
    }

    public open(): void {
        this.init();
        this.modalRef = this.modalService.show(this.modal);
    }

    private init(): void {
        this.carModel = new Car();
    }

    public onSubmit(): void {
        this.loading = true;
        this.fleetService.addCarToFleet(this.carModel)
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.modalRef.hide();
                this.toastrService.success('A new car has been successfully added to your fleet.');
                this.addedCarEvent.emit();
            }, error => this.toastrService.error(JSON.stringify(error)));
    }
}
