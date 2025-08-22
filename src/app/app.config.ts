import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { jwtInterceptor } from './_interceptor/jwt.interceptor';
import { errorInterceptor } from './_interceptor/error.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { provideStore, StoreModule } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ProductsFeature } from './core/store/products/products.reducer';
import { ProductsEffects } from './core/store/products/products.effects';
import { SharedFeature } from './shared/_store/shared.reducer';
import { FormChecksFeature } from './core/store/formchecks/formchecks.reducer';
import { FormChecksEffects } from './core/store/formchecks/formchecks.effects';
import { ProductConfigurationFeature } from './core/store/product-configurations/product-configuration.reducer';
import { ProductConfigurationsEffects } from './core/store/product-configurations/product-configurations.effects';
import { BatchFeature } from './core/store/batch/batch.reducer';
import { BatchEffects } from './core/store/batch/batch.effects';
import { BranchFeature } from './core/store/branch/branch.reducers';
import { BranchEffects } from './core/store/branch/branch.effects';
import { SharedEffects } from './shared/_store/shared.effects';
import { TagFeature } from './core/store/tag/tag.reducers';
import { TagEffects } from './core/store/tag/tag.effects';
import { OrderFileFeature } from './core/store/order-file/order-file.reducers';
import { OrderFileEffects } from './core/store/order-file/order-file.effects';
import { CheckOrderFeature } from './core/store/check-order/check-order.reducers';
import { CheckOrderEffects } from './core/store/check-order/check-order.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([jwtInterceptor, errorInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-full-width',
    }),
    provideAnimationsAsync(),
    provideStore({
      shared: SharedFeature.reducer,
      products: ProductsFeature.reducer,
      formChecks: FormChecksFeature.reducer,
      productConfiguration: ProductConfigurationFeature.reducer,
      branch: BranchFeature.reducer,
      batch: BatchFeature.reducer,
      tag: TagFeature.reducer,
      orderFiles: OrderFileFeature.reducer,
      checkOrder: CheckOrderFeature.reducer,
    }),
    provideEffects([
      ProductsEffects,
      FormChecksEffects,
      ProductConfigurationsEffects,
      BatchEffects,
      BranchEffects,
      SharedEffects,
      TagEffects,
      OrderFileEffects,
      CheckOrderEffects,
    ]),
  ],
};
