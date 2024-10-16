import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagMappingService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;

  addTagMapping(bankInfoId: any, tagId: any, formData: any) {
    return this.http.post(this.commandUrl + bankInfoId + "/Tag/" + tagId + "/mapping", formData);
  }

  deleteTagMapping(bankInfoId: any, tagId: any, mapId: any) {
    return this.http.delete(this.commandUrl + bankInfoId + "/Tag/" + tagId + "/mapping/" + mapId);
  }
}
