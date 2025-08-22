import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateTagMappingRequest, TagMapping } from '../../_models/tag-mapping';
import {
  CheckInventory,
  CheckInventoryQueryRequest,
} from '../../_models/check-inventory';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getAllTags(bankInfoId: string) {
    return this.http.get<any>(this.queryUrl + bankInfoId + '/Tag');
  }

  getTagMapping(bankInfoId: string, tagId: string) {
    return this.http.get<any>(this.queryUrl + bankInfoId + '/Tag/' + tagId);
  }

  getCheckInventory(query: CheckInventoryQueryRequest) {
    var params = new HttpParams()
      .set('tagId', query.tagId)
      .set('isActive', query.isActive)
      .set('isRepeating', query.isRepeating)
      .set('currentPage', query.currentPage)
      .set('pageSize', query.pageSize);
    if (query.branchIds && query.branchIds.length > 0) {
      query.branchIds.forEach((branchId) => {
        params = params.append('branchIds', branchId);
      });
    }
    if (query.productIds && query.productIds.length > 0) {
      query.productIds.forEach((productId) => {
        params = params.append('productIds', productId);
      });
    }
    if (query.formCheckType && query.formCheckType.length > 0) {
      query.formCheckType.forEach((formCheckType) => {
        params = params.append('formCheckType', formCheckType);
      });
    }

    return this.http.get<any>(this.queryUrl + query.tagId + '/CheckInventory', {
      params,
    });
  }

  addNewtag(bankInfoId: any, formData: any) {
    return this.http.post(this.commandUrl + bankInfoId + '/Tag', formData);
  }

  updateTag(bankInfoId: any, tagId: any, formData: any) {
    return this.http.put(
      this.commandUrl + bankInfoId + '/Tag/' + tagId,
      formData
    );
  }

  deleteTag(bankInfoId: any, tagId: any) {
    return this.http.delete(this.commandUrl + bankInfoId + '/Tag/' + tagId);
  }

  lockTag(bankInfoId: any, tagId: any) {
    return this.http.post(
      this.commandUrl + bankInfoId + '/Tag/Lock/' + tagId,
      {}
    );
  }

  addNewTagMapping(
    bankInfoId: any,
    tagId: any,
    tagMapping: CreateTagMappingRequest
  ) {
    return this.http.post(
      this.commandUrl + bankInfoId + '/Tag/' + tagId + '/mapping',
      tagMapping
    );
  }

  updateTagMapping(
    bankInfoId: any,
    tagId: any,
    tagMappingId: any,
    tagMapping: TagMapping[]
  ) {
    return this.http.put(
      this.commandUrl +
        bankInfoId +
        '/Tag/' +
        tagId +
        '/mapping/' +
        tagMappingId,
      tagMapping
    );
  }

  deleteTagMapping(bankInfoId: any, tagId: any, tagMappingId: any) {
    return this.http.delete(
      this.commandUrl +
        bankInfoId +
        '/Tag/' +
        tagId +
        '/mapping/' +
        tagMappingId
    );
  }

  createCheckInventory(checkInventory: CheckInventory) {
    return this.http.post(this.commandUrl + 'CheckInventory', checkInventory);
  }

  inititateCheckInventory(checkInventory: CheckInventory) {
    return this.http.post(
      this.commandUrl + 'CheckInventory/InitiateCheckInventories',
      checkInventory
    );
  }

  updateCheckInventory(checkInventory: CheckInventory) {
    return this.http.put(
      this.commandUrl + 'CheckInventory/' + checkInventory.id,
      checkInventory
    );
  }

  deleteCheckInventory(checkInventoryId: string) {
    return this.http.delete(
      this.commandUrl + 'CheckInventory/' + checkInventoryId
    );
  }

  setCheckInventoryActive(checkInventoryId: string) {
    return this.http.post(
      this.commandUrl + 'CheckInventory/active/' + checkInventoryId,
      null
    );
  }
}
