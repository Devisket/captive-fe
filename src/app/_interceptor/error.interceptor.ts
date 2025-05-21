import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key])
                }
              }
              throw modalStateErrors.flat();
            } else {
              messageService.add({severity:'error', summary: 'Validation Errors', detail: error.error.Message, life:10000});
            }
            break;
          case 401:
            messageService.add({severity:'error', summary: 'Unauthorised', detail: error.status})
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            console.log(error);
            console.log(error.error.Message);
            messageService.add({severity:'error', summary: 'Server Error', detail: error.error.Message, life:10000})
            break;
          default:
            messageService.add({severity:'error', summary: 'Something unexpected went wrong'});
            break;
        }
      }
      throw error;
    })
  )
};
