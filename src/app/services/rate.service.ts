import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Rate} from "../entities/Rate";
import {parseDateToString} from "../helpers/help-functions";
import {environment} from "../../environments/environment";

const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class RateService {
  private url = "/api/v1/rates";

  constructor(private http: HttpClient) {
  }

  getRates() {
    return this.http.get<Array<Rate>>(HOST + this.url);
  }

  getRatesByIdOrders(id:number| string) {
    return this.http.get<Array<Rate>>(HOST + this.url+ '/' + id + '/order');
  }

  getRate(id: number | string) {
    return this.http.get<Rate>(HOST + this.url + '/' + id);
  }

  createRate(rate: Rate, idOrders: number) {
    rate.ordersidfk = idOrders;
    rate.buydate = parseDateToString(rate.buydate);
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post<Rate>(HOST + this.url, JSON.stringify(rate), {headers: myHeaders});
  }

  updateRate(id: number | string, rate: Rate, idOrders: number) {
    rate.ordersidfk = idOrders
    rate.buydate = parseDateToString(rate.buydate);
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<Rate>(HOST + this.url + '/' + id, JSON.stringify(rate), {headers: myHeaders});
  }

  deleteRate(id: number | string) {
    return this.http.delete<Rate>(HOST + this.url + '/' + id);
  }
}
