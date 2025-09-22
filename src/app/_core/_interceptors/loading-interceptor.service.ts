import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from '../_services/loading.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptorService {

    private activeRequest = 0;

    constructor(private loadingService: LoadingService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.url.endsWith('StayingAlive.php')) {
            if (this.activeRequest === 0) {
                this.loadingService.startLoading();
            }
            this.activeRequest++;
        }
        return next.handle(request).pipe(
            finalize(() => {
                if (!request.url.endsWith('StayingAlive.php')) {
                    this.activeRequest--;
                    if (this.activeRequest === 0) {
                        this.loadingService.stopLoading();
                    }
                }
            }));
    }
}
