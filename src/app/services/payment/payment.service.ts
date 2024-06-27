import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PAYMENT_API_ENDPOINTS } from "src/app/core/global/constants/api-endpoints";
import { PaymentIntentDto } from "src/app/shared/models/interfaces/payment.interface";
import { environment } from "src/environments/environment.dev";

const header = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private uri = environment.url

  constructor(private httpClient: HttpClient) { }

  public pay(paymentIntentDto: PaymentIntentDto): Observable<string> {
    return this.httpClient.post<string>(this.uri + `/${PAYMENT_API_ENDPOINTS.REQUEST_MAPPING}` + '/paymentintent', paymentIntentDto, header,);
  }

  public confirm(id: string, paymentIntentDto: PaymentIntentDto): Observable<string> {
    return this.httpClient.post<string>(this.uri + `/${PAYMENT_API_ENDPOINTS.REQUEST_MAPPING}` + `/confirm/${id}`, paymentIntentDto, header);
  }

  public cancel(id: string): Observable<string> {
    return this.httpClient.post<string>(this.uri + `/${PAYMENT_API_ENDPOINTS.REQUEST_MAPPING}` + `/cancel/${id}`, {}, header);
  }
}
