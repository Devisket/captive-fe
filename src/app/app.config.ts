import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { jwtInterceptor } from './_interceptor/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './_interceptor/loading.interceptor';
import { errorInterceptor } from './_interceptor/error.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { sharedReducer } from './_store/shared/shared.reducer';
import { ProductsFeature } from './_components/products/_store/products/products.reducer';
import { ProductsEffects } from './_components/products/_store/products/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, loadingInterceptor, errorInterceptor])),
    provideAnimations(),
    provideToastr({
        positionClass: 'toast-bottom-full-width'
    }),
    importProvidersFrom(NgxSpinnerModule, ModalModule.forRoot()), provideAnimationsAsync(),
    provideStore({
      shared: sharedReducer,
      products: ProductsFeature.reducer
    }),
    provideEffects([ProductsEffects])
]
};
