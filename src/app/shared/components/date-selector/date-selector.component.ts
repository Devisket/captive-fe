import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-date-selector',
    standalone: true,
    imports: [FormsModule, CalendarModule, ButtonModule],
    template: `
        <div class="date-selector p-2 flex flex-column align-items-center justify-content-between">
            <p-calendar 
                [(ngModel)]="selectedDate" 
                [showIcon]="true"
                dateFormat="yy-mm-dd"
                appendTo="body"
                placeholder="Select a date">
            </p-calendar>
            <div class="pt-5">
                <button pButton type="button" label="Select" (click)="selectDate()" [disabled]="!selectedDate"></button>
            </div>
        </div>
    `,
})
export class DateSelectorComponent {
    @Input() title: string = 'Select Date';
    @Input() initialDate: Date | null = null;
    selectedDate: Date = new Date();
    private ref = inject(DynamicDialogRef);

    selectDate(): void {
        this.ref.close(this.selectedDate);
    }

    cancel(): void {
        this.ref.close(null);
    }
}