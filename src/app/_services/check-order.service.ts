import { inject, Injectable } from "@angular/core";
import { CheckOrders } from "../_models/check-order";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CheckOrderService{

    private http = inject(HttpClient);
    baseCommandUrl = environment.baseCommandUri;

    saveCheckOrder(bankid:string, orderFileId:string, checkOrders: CheckOrders) {
        const url = `${this.baseCommandUrl}/api/${bankid}/checkorder/floating`;

        return this.http.post(url, {
          orderFileId,
          checkOrders : [checkOrders]
        });
    }
}