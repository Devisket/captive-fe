import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnumsService {

  statuses: any = [];
  tags: any = [];

  branchStatus(){
     return this.statuses = ["active","closing","inactive"];
  }

  branchTags(){
    return this.tags = ["branch","product","mix"];
  }
}
