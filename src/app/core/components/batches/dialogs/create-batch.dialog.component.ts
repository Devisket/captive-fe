import { Component, inject } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: 'app-create-batch-dialog',
    template: ``,
    styles: [`
        
    `]
})
export class CreateBatchDialogComponent {
    batchName:string = '';
    deliveryDate:string = '';
    private ref = inject(DynamicDialogRef);

    
}