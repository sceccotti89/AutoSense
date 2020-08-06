import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FleetService } from 'src/app/shared/services/fleet.service';
import { flatMap } from 'rxjs/operators';
import { Car } from 'src/app/shared/models/car.model';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DeleteCarModalComponent } from './components/delete-car-modal/delete-car.modal.component';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    public loading: boolean;
    public selectedCar: Car;
    public readonly zoom: number = 8;
    public modalRef: BsModalRef;

    @ViewChild(DeleteCarModalComponent, { static: false }) deleteCarModal: DeleteCarModalComponent;

    constructor(private fleetService: FleetService,
                private router: Router,
                private route: ActivatedRoute,
                private toastrService: ToastrService) {}

    public ngOnInit(): void {
        this.loading = true;
        this.route.params
            .pipe(flatMap((params) => this.fleetService.getCarDetails(params.id)))
            .subscribe((response) => {
                this.selectedCar = response.message;
                this.loading = false;
            }, (err) => {
                this.toastrService.error(err);
                this.loading = false;
            });
    }

    public backToHome(): void {
        this.router.navigateByUrl('/');
    }

    public openDeleteCarModal(): void {
        this.deleteCarModal.open(this.selectedCar.id);
    }
}
