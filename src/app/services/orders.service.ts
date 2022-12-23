import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Orders} from "../entities/Orders";
import {environment} from "../../environments/environment";

const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private url = "/api/v1/orders";

  constructor(private http: HttpClient) {
  }

  getOrders() {
    return this.http.get<Array<Orders>>(HOST + this.url);
  }

  getOrder(id: number | string) {
    return this.http.get<Orders>(HOST + this.url + '/' + id);
  }

  createOrders(orders: Orders) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post<Orders>(HOST + this.url, JSON.stringify(orders), {headers: myHeaders});
  }

  updateOrders(id: number | string, orders: Orders) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<Orders>(HOST + this.url + '/' + id, JSON.stringify(orders), {headers: myHeaders});
  }

  deleteOrders(id: number | string) {
    return this.http.delete<Orders>(HOST + this.url + '/' + id);
  }
}
