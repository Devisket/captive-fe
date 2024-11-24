import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  // Check for the custom header
  const skipSpinner = req.headers.has('X-Skip-Spinner');

  if (!skipSpinner) {
    busyService.busy();
  }

  return next(req).pipe(
    delay(500),
    finalize(() => {
      if (!skipSpinner) {
        busyService.idle();
      }
    })
  )
};
