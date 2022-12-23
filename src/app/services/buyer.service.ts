import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Buyer} from "../entities/Buyer";
import {parseDateToString} from "../helpers/help-functions";
import {environment} from "../../environments/environment";

const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class BuyerService {
  private url = "/api/v1/buyers";

  constructor(private http: HttpClient) {
  }

  getBuyers() {
    return this.http.get<Array<Buyer>>(HOST + this.url);
  }

  getBuyer(id: number | string) {
    return this.http.get<Buyer>(HOST + this.url + '/' + id);
  }

  createBuyer(buyer: Buyer) {
    buyer.birthday = parseDateToString(buyer.birthday);
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post<Buyer>(HOST + this.url, JSON.stringify(buyer), {headers: myHeaders});
  }

  updateBuyer(id: number | string, buyer: Buyer) {
    buyer.birthday = parseDateToString(buyer.birthday);
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<Buyer>(HOST + this.url + '/' + id, JSON.stringify(buyer), {headers: myHeaders});
  }

  deleteBuyer(id: number | string) {
    return this.http.delete<Buyer>(HOST + this.url + '/' + id);
  }
}
