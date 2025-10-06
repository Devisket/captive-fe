import { Component, Input, input, isStandalone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SharedFeature } from '../../_store/shared.reducer';

@Component({
  selector: 'app-branch-selector',
  templateUrl: './branch-selector.html',
  styleUrls: ['./branch-selector.scss'],
})
export class BranchSelectorComponent implements OnInit {
  @Input("multiple-select")isMultiple : boolean = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(SharedFeature.getAllBranches).subscribe((branches) => {
    
    });
  }
}
