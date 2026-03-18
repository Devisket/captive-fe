import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  CheckInventory,
  CheckInventoryQueryRequest,
  ImportCheckInventoryResult,
} from '../../_models/check-inventory';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getCheckInventory(query: CheckInventoryQueryRequest) {
    let params = new HttpParams()
      .set('currentPage', query.currentPage)
      .set('pageSize', query.pageSize);

    if (query.isActive !== undefined) params = params.set('isActive', query.isActive);
    if (query.isRepeating !== undefined) params = params.set('isRepeating', query.isRepeating);

    query.branchIds?.forEach((id) => { params = params.append('branchIds', id); });
    query.productIds?.forEach((id) => { params = params.append('productIds', id); });
    query.formCheckType?.forEach((t) => { params = params.append('formCheckType', t); });

    return this.http.get<any>(this.queryUrl + query.bankId + '/CheckInventory', { params });
  }

  createCheckInventory(checkInventory: CheckInventory) {
    return this.http.post(this.commandUrl + 'CheckInventory', checkInventory);
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

  importCheckInventory(bankId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportCheckInventoryResult>(
      this.commandUrl + `CheckInventory/${bankId}/import`,
      formData
    );
  }
}
