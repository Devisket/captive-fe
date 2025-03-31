import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { BankDetailComponent } from './_components/banks/bank-detail/bank-detail.component';
import { EditBankComponent } from './_components/banks/edit-bank/edit-bank.component';
import { EditProfileComponent } from './_components/auth/edit-profile/edit-profile.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { AddBankComponent } from './_components/banks/add-bank/add-bank.component';
import { UserListComponent } from './_components/users/user-list/user-list.component';
import { TestErrorsComponent } from './_components/errors/test-errors/test-errors.component';
import { NotFoundComponent } from './_components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './_components/errors/server-error/server-error.component';
import { BankListComponent } from './_components/banks/bank-list/bank-list.component';
import { AddProductComponent } from './_components/products/add-product/add-product.component';
import { EditProductComponent } from './_components/products/edit-product/edit-product.component';
import { AddFormCheckComponent } from './_components/form-checks/add-form-check/add-form-check.component';
import { EditFormCheckComponent } from './_components/form-checks/edit-form-check/edit-form-check.component';
import { AddBatchComponent } from './_components/batches/add-batch/add-batch.component';
import { AddConfigurationComponent } from './_components/product-configurations/add-configuration/add-configuration.component';
import { ViewConfigurationComponent } from './_components/product-configurations/view-configuration/view-configuration.component';
import { UploadOrderFilesComponent } from './_components/order-files/upload-order-files/order-files-list.component';
import { TagListComponent } from './_components/tags/tag-list/tag-list.component';
import { CheckValidationListComponent } from './_components/check-validation/check-validation-list/check-validation-list.component';
import { AddTagComponent } from './_components/tags/add-tag/add-tag.component';
import { EditTagComponent } from './_components/tags/edit-tag/edit-tag.component';
import { AddTagMappingComponent } from './_components/tags/add-tag-mapping/add-tag-mapping.component';
import { AddCheckValidationComponent } from './_components/check-validation/add-check-validation/add-check-validation.component';
import { EditCheckValidationComponent } from './_components/check-validation/edit-check-validation/edit-check-validation.component';
import { ProductDetailComponent } from './_components/products/product-detail/product-detail.component';

export const routes: Routes = [
    {path: '', component: BankListComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'users', component: UserListComponent},
            {path: 'banks', component: BankListComponent},
            {path: 'banks/:id', component: BankDetailComponent},
            {path: 'banks/:id/edit', component: EditBankComponent,
                canDeactivate: [preventUnsavedChangesGuard]
            },
            {path: 'edit-profile', component: EditProfileComponent},
            { path: 'register-bank', component: AddBankComponent },
            { path: 'add-check-validation/:bankId', component: AddCheckValidationComponent },
            { path: 'edit-check-validation/:checkValidationId/bank/:bankId', component: EditCheckValidationComponent },
            { path: 'tag-list/:checkValidationId/bank/:bankId', component: TagListComponent },
            { path: 'add-tag/:checkValidationId/bank/:bankId', component: AddTagComponent },
            { path: 'add-tag-mapping/:tagId/checkValidation/:checkValidationId/bank/:bankId', component: AddTagMappingComponent },
            { path: 'edit-tag/:tagId/checkValidation/:checkValidationId/bank/:bankId', component: EditTagComponent },
            { path: 'add-product-type/:id', component: AddProductComponent },
            { path: 'check-validation-list/:id', component: CheckValidationListComponent },
            { path: 'edit-product/:id/bank/:bankId', component: EditProductComponent },
            { path: 'add-form-check/:id/bank/:bankId', component: AddFormCheckComponent },
            { path: 'edit-form-check/:id/product/:productId/bank/:bankId', component: EditFormCheckComponent },
            { path: 'add-configuration/:productId/bank/:bankId', component: AddConfigurationComponent },
            { path: 'view-configuration/:productId/bank/:bankId', component: ViewConfigurationComponent },
            { path: 'upload-order-files/:batchId/bank/:bankId', component: UploadOrderFilesComponent },
            { path: 'add-batch/:bankId', component: AddBatchComponent },
            { path: 'product-detail/:productId/bank/:bankId', component: ProductDetailComponent }
        ]
    },
    {path: 'errors', component: TestErrorsComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {
        path: '**', // Your specified path
        component: BankListComponent,
        pathMatch: 'full',
    },

];
