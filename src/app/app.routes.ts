import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { BankDetailComponent } from './_components/banks/bank-detail/bank-detail.component';
import { UserListComponent } from './_components/users/user-list/user-list.component';
import { TestErrorsComponent } from './_components/errors/test-errors/test-errors.component';
import { NotFoundComponent } from './_components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './_components/errors/server-error/server-error.component';
import { BankListComponent } from './_components/banks/bank-list/bank-list.component';
import { ProductDetailComponent } from './_components/products/product-detail/product-detail.component';
import { BranchListComponent } from './_components/branches/branch-list/branch-list.component';
import { ProductListComponent } from './_components/products/product-list/product-list.component';
import { BatchListComponent } from './_components/batches/batch-list/batch-list.component';
import { CheckInventoryListComponent } from './_components/check-inventory/check-inventory-list/check-inventory-list.component';
import { TagListComponent } from './_components/tags/tag-list/tag-list.component';
export const appRoutes: Routes = [
  { path: '', component: BankListComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UserListComponent },
      { path: 'banks', component: BankListComponent },
      { path: 'banks/:id/bank-detail', loadChildren: () => bankDetailsRoutes },
      // {path: 'banks/:id/edit', component: EditBankComponent,
      //     canDeactivate: [preventUnsavedChangesGuard]
      // },
      // { path: 'edit-profile', component: EditProfileComponent},
      // { path: 'register-bank', component: AddBankComponent },
      // { path: 'add-check-validation/:bankId', component: AddCheckValidationComponent },
      // { path: 'edit-check-validation/:checkValidationId/bank/:bankId', component: EditCheckValidationComponent },
      // { path: 'tag-list/:checkValidationId/bank/:bankId', component: TagListComponent },
      // { path: 'add-tag/:checkValidationId/bank/:bankId', component: AddTagComponent },
      // { path: 'add-tag-mapping/:tagId/checkValidation/:checkValidationId/bank/:bankId', component: AddTagMappingComponent },
      // { path: 'edit-tag/:tagId/checkValidation/:checkValidationId/bank/:bankId', component: EditTagComponent },
      // { path: 'add-product-type/:id', component: AddProductComponent },
      // { path: 'check-validation-list/:id', component: CheckValidationListComponent },
      // { path: 'edit-product/:id/bank/:bankId', component: EditProductComponent },
      // { path: 'add-form-check/:id/bank/:bankId', component: AddFormCheckComponent },
      // { path: 'edit-form-check/:id/product/:productId/bank/:bankId', component: EditFormCheckComponent },
      // { path: 'upload-order-files/:batchId/bank/:bankId', component: UploadOrderFilesComponent },
      // { path: 'add-batch/:bankId', component: AddBatchComponent },
    ],
  },
  { path: 'errors', component: TestErrorsComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  // {
  //     path: '**', // Your specified path
  //     component: BankListComponent,
  //     pathMatch: 'full',
  // },
];

export const bankDetailsRoutes: Routes = [
  {
    path: '',
    component: BankDetailComponent,
    children: [
      {
        path: 'branches',
        component: BranchListComponent,
      },
      {
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'product-detail/:productId',
        component: ProductDetailComponent,
      },
      {
        path: 'check-validations',
        component: TagListComponent,
      },
      {
        path: 'batches',
        component: BatchListComponent,
      },
      {
        path: 'batch-detail/:batchId',
        component: BatchListComponent,
      },
    ],
  },
];
