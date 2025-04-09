import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TagMapping } from '../_models/tag-mapping';

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

  getCheckInventory(tagId: string) {
    return this.http.get<any>(this.queryUrl + tagId + '/CheckInventory');
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

  addNewTagMapping(bankInfoId: any, tagId: any, tagMapping: TagMapping[]) {
    return this.http.post(this.commandUrl + bankInfoId + '/Tag/' + tagId + '/TagMapping', tagMapping);
  }

  updateTagMapping(bankInfoId: any, tagId: any, tagMappingId: any, tagMapping: TagMapping[]) {
    return this.http.put(this.commandUrl + bankInfoId + '/Tag/' + tagId + '/TagMapping/' + tagMappingId, tagMapping);
  }

  deleteTagMapping(bankInfoId: any, tagId: any, tagMappingId: any) {
    return this.http.delete(this.commandUrl + bankInfoId + '/Tag/' + tagId + '/TagMapping/' + tagMappingId);
  }
}
