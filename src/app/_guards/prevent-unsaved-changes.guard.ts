import { CanDeactivateFn } from '@angular/router';
import { EditBankComponent } from '../_components/banks/edit-bank/edit-bank.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<EditBankComponent> = (component) => {
  if(component.editBankForm?.dirty){
    return confirm('Are you sure you want to continue? Any unsaved changes will be lost')
  }

  return true;
};
