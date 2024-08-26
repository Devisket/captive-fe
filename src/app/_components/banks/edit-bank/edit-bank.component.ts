import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { BanksService } from '../../../_services/BanksService';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-bank',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-bank.component.html',
  styleUrl: './edit-bank.component.css'
})
export class EditBankComponent implements OnInit{
  @ViewChild('editBankForm') editBankForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.editBankForm?.dirty) {
      $event.returnValue = true;
    }
  }
  
  private bankService = inject(BanksService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  bank?: Bank;
  model: any = {}
  
  ngOnInit(): void {
    this.loadBank();
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get('id');
    if(!bankId) return;
   
  }
}
