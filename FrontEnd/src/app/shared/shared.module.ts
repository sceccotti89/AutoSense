import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FleetService } from './services/fleet.service';
import { ApiKeyInterceptor } from './services/api-key.interceptor';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './components/button/button.component';
import { CheckForUpdateService } from './services/check-for-update.service';

@NgModule({
    imports: [
        CommonModule,
        ButtonsModule.forRoot(),
        ModalModule.forRoot()
    ],
    declarations: [
        ButtonComponent
    ],
    exports: [
        CommonModule,
        ButtonComponent,
        FormsModule
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                FleetService,
                CheckForUpdateService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ApiKeyInterceptor,
                    multi: true
                }
            ]
        };
    }
}
