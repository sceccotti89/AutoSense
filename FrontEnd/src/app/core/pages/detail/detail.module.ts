import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { DeleteCarModalComponent } from './components/delete-car-modal/delete-car.modal.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';

const routes: Routes = [{
    path: '',
    component: DetailComponent
}];

@NgModule({
    declarations: [
        DetailComponent,
        DeleteCarModalComponent,
        CarDetailComponent
    ],
    imports: [
        SharedModule,
        AgmCoreModule.forRoot({
            apiKey: environment.apiKeys.google
        }),
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class DetailModule { }
