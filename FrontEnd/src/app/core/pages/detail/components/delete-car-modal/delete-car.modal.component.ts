import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FleetService } from 'src/app/shared/services/fleet.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-delete-car-modal',
    templateUrl: './delete-car.modal.component.html',
    styleUrls: ['./delete-car.modal.component.scss']
})
export class DeleteCarModalComponent {
    @Output() deletedCarEvent: EventEmitter<void>;

    public modalRef: BsModalRef;
    private carId: string;
    public loading: boolean;

    @ViewChild('template', { static: false }) modal: any;

    constructor(private fleetService: FleetService,
                private modalService: BsModalService,
                private toastrService: ToastrService) {
        this.deletedCarEvent = new EventEmitter<void>();
    }

    public open(carId: string): void {
        this.carId = carId;
        this.modalRef = this.modalService.show(this.modal);
    }

    public onSubmit(): void {
        this.loading = true;
        this.fleetService.deleteCarFromFleet(this.carId)
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.toastrService.success('Selected car has been successfully removed from your fleet.');
                this.deletedCarEvent.emit();
                this.modalRef.hide();
            }, error => this.toastrService.error(JSON.stringify(error)));
    }
}
