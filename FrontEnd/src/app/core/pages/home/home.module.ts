import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddCarModalComponent } from './components/add-car-modal/add-car.modal.component';

@NgModule({
    declarations: [
      HomeComponent,
      AddCarModalComponent
    ],
    exports: [
        HomeComponent
    ],
    imports: [
      SharedModule
    ],
    providers: []
})
export class HomeModule { }
