import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FleetService } from 'src/app/shared/services/fleet.service';
import { Car } from 'src/app/shared/models/car.model';
import { ToastrService } from 'ngx-toastr';
import { AddCarModalComponent } from './components/add-car-modal/add-car.modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public loading = false;
    public fleet: Car[] = [];

    public readonly textMessage = 'YOUR FLEET IS EMPTY. LET\'S ADD A NEW CAR!!';

    @ViewChild(AddCarModalComponent, { static: false }) addCarModal: AddCarModalComponent;

    constructor(private fleetService: FleetService,
                private toastr: ToastrService,
                private router: Router) {}

    public ngOnInit(): void {
        this.loadFleet();
    }

    public loadFleet(): void {
        this.loading = true;
        this.fleetService.getFleet()
            .pipe(finalize(() => this.loading = false))
            .subscribe((response) => {
                this.fleet = response.message;
            }, error => this.toastr.error(JSON.stringify(error)));
    }

    public openAddCarModal(): void {
        this.addCarModal.open();
    }

    public selectRow(car: Car) {
        this.router.navigateByUrl(`/${car.id}`);
    }
}
