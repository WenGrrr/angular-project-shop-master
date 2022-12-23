import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {parseDateToString} from "../helpers/help-functions";
import {Seller} from "../entities/Seller";
import {environment} from "../../environments/environment";

const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private url = "/api/v1/sellers";

  constructor(private http: HttpClient) {
  }

  getSellers() {
    return this.http.get<Array<Seller>>(HOST + this.url);
  }

  getSeller(id: number | string) {
    return this.http.get<Seller>(HOST + this.url + '/' + id);
  }

  createSeller(seller: Seller) {
    seller.birthday = parseDateToString(seller.birthday);
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post<Seller>(HOST + this.url, JSON.stringify(seller), {headers: myHeaders});
  }


  updateSeller(id: number | string, seller: Seller) {
    seller.birthday = parseDateToString(seller.birthday);
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<Seller>(HOST + this.url + '/' + id, JSON.stringify(seller), {headers: myHeaders});
  }

  deleteSeller(id: number | string) {
    return this.http.delete<Seller>(HOST +this.url + '/' + id);
  }
}
