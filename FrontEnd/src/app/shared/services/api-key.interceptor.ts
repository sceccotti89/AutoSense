import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class ApiKeyInterceptor implements HttpInterceptor {
    constructor() {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-api-key': environment.apiKeys.aws
        });

        const cloneReq = req.clone({
            headers: httpHeaders
        });

        return next.handle(cloneReq).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(`Error: ${error.error.message}`);
            })
        );
    }
}
