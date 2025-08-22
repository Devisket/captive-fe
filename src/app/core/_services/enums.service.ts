import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnumsService {

  statuses: any = [];
  tags: any = [];
  batchFileStatus: any = [];
  validationTypes: any = [];

  branchStatus(){
     return this.statuses = ["Active","Closing","Inactive"];
  }

  branchTags(){
    return this.tags = ["Branch","Product","FormCheck","Mix"];
  }

  batchfileStatuses(){
    return this.batchFileStatus = [
      "Pending",
      "Fail",
      "Success" ];
  }

  validationType(){
    return this.validationTypes = [
      "Branch", //Validate check inventory based from branch
      "Product", //Validate check inventory based from product
      "Account", //Validate check inventory based form account
      "FormCheck", //Validate check inventory based from form check
      "Mix" // It could be mix of branch, product and form check
    ];
  }
}
