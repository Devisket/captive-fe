import { inject, Injectable } from "@angular/core";
import { CheckOrders } from "../_models/check-order";
import { HttpClient } from "@microsoft/signalr";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CheckOrderService{

    private http = inject(HttpClient);
    baseCommandUrl = environment.baseCommandUri;

    saveCheckOrder(checkOrder: CheckOrders) {
        const url = `${this.baseCommandUrl}/checkorder`;

        var request = JSON.stringify(checkOrder);

        return this.http.post(url, {content: request});
    }
}