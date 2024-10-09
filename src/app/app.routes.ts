import { Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
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
import { AddProductTypeComponent } from './_components/product-types/add-product-type/add-product-type.component';
import { EditProductTypeComponent } from './_components/product-types/edit-product-type/edit-product-type.component';
import { AddFormCheckComponent } from './_components/form-checks/add-form-check/add-form-check.component';
import { EditFormCheckComponent } from './_components/form-checks/edit-form-check/edit-form-check.component';
import { AddBatchComponent } from './_components/batches/add-batch/add-batch.component';
import { AddConfigurationComponent } from './_components/product-configurations/add-configuration/add-configuration.component';
import { ViewConfigurationComponent } from './_components/product-configurations/view-configuration/view-configuration.component';
import { UploadOrderFilesComponent } from './_components/order-files/upload-order-files/upload-order-files.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
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
            { path: 'add-product-type/:id', component: AddProductTypeComponent },
            { path: 'edit-product-type/:id/bank/:bankId', component: EditProductTypeComponent },
            { path: 'add-form-check/:id/bank/:bankId', component: AddFormCheckComponent },
            { path: 'edit-form-check/:id/product/:productId/bank/:bankId', component: EditFormCheckComponent },
            { path: 'add-configuration/:productId/bank/:bankId', component: AddConfigurationComponent },
            { path: 'view-configuration/:productId/bank/:bankId', component: ViewConfigurationComponent },
            { path: 'upload-order-files/:batchId/bank/:bankId', component: UploadOrderFilesComponent },
            { path: 'add-batch/:bankId', component: AddBatchComponent }
        ]
    },
    {path: 'errors', component: TestErrorsComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {
        path: '**', // Your specified path
        component: HomeComponent,
        pathMatch: 'full',
    },

];
