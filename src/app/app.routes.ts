import { Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { authGuard } from './_guards/auth.guard';
import { BankDetailComponent } from './_components/banks/bank-detail/bank-detail.component';
import { EditBranchComponent } from './_components/banks/edit-branch/edit-branch.component';
import { EditBankComponent } from './_components/banks/edit-bank/edit-bank.component';
import { BankListComponent } from './_components/banks/bank-list/bank-list.component';
import { EditProfileComponent } from './_components/auth/edit-profile/edit-profile.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { AddBankComponent } from './_components/banks/add-bank/add-bank.component';
import { UserListComponent } from './_components/users/user-list/user-list.component';
import { TestErrorsComponent } from './_components/errors/test-errors/test-errors.component';
import { NotFoundComponent } from './_components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './_components/errors/server-error/server-error.component';

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
            {path: 'branches/:id', component: EditBranchComponent},
            {path: 'edit-profile', component: EditProfileComponent},
            { path: 'register-bank', component: AddBankComponent }
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
