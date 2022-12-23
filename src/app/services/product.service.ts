import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Product} from "../entities/Product";
import {environment} from "../../environments/environment";


const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = "/api/v1/products";

  constructor(private http: HttpClient) {
  }

  getProducts() {
    return this.http.get<Array<Product>>(HOST + this.url);
  }

  getProduct(id: number | string) {
    return this.http.get<Product>(HOST + this.url + '/' + id);
  }

  createProduct(product: Product) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post<Product>(HOST + this.url, JSON.stringify(product), {headers: myHeaders});
  }

  updateProduct(id: number | string, product: Product) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<Product>(HOST + this.url + '/' + id, JSON.stringify(product), {headers: myHeaders});
  }

  deleteProduct(id: number | string) {
    return this.http.delete<Product>(HOST + this.url + '/' + id);
  }
}
