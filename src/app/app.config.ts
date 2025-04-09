import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { jwtInterceptor } from './_interceptor/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './_interceptor/loading.interceptor';
import { errorInterceptor } from './_interceptor/error.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { provideStore, StoreModule } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ProductsFeature } from './_components/products/_store/products/products.reducer';
import { ProductsEffects } from './_components/products/_store/products/products.effects';
import { SharedFeature } from './_store/shared/shared.reducer';
import { FormChecksFeature } from './_components/products/_store/formchecks/formchecks.reducer';
import { FormChecksEffects } from './_components/products/_store/formchecks/formchecks.effects';
import { ProductConfigurationFeature } from './_components/products/_store/product-configurations/product-configuration.reducer';
import { ProductConfigurationsEffects } from './_components/products/_store/product-configurations/product-configurations.effects';
import { BatchFeature } from './_components/branches/_store/batch/batch.reducer';
import { BatchEffects } from './_components/branches/_store/batch/batch.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([jwtInterceptor, loadingInterceptor, errorInterceptor])),
    provideAnimations(),
    provideToastr({
        positionClass: 'toast-bottom-full-width'
    }),
    importProvidersFrom(NgxSpinnerModule), provideAnimationsAsync(),
    provideStore({
      shared: SharedFeature.reducer,
      products: ProductsFeature.reducer,
      formChecks: FormChecksFeature.reducer,
      productConfiguration: ProductConfigurationFeature.reducer,
      batch: BatchFeature.reducer,
    }),
    provideEffects([ProductsEffects, FormChecksEffects, ProductConfigurationsEffects, BatchEffects])
]
};
