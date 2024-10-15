import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  addNewtag(bankInfoId: any, formData: any) {
    return this.http.post(this.commandUrl + bankInfoId + "/Tag", formData);
  }

  updateTag(bankInfoId: any, tagId: any, formData: any) {
    return this.http.put(this.commandUrl + bankInfoId + "/Tag/" + tagId, formData);
  }

  deleteTag(bankInfoId: any, tagId: any) {
    return this.http.delete(this.commandUrl + bankInfoId + "/Tag/" + tagId);
  }
}
