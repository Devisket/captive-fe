import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SharedService{
    private http = inject(HttpClient);
    commandUrl = environment.commandUrl;
    queryUrl = environment.queryUrl;

    getBankValues(bankId: string) {
        return this.http.get<any>(`${this.queryUrl}${bankId}/values`);
    }
}