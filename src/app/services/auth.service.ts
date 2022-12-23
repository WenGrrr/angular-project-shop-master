import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";


const AUTH_API = '/api/v1/auth/';
const HOST = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(login: string, password: string): Observable<any> {
    return this.http.post(
      HOST + AUTH_API + 'login',
      {
        login,
        password,
      },
      httpOptions
    );
  }

  register(login: string, email: string, password: string): Observable<any> {
    return this.http.post(
      HOST + AUTH_API + 'signup',
      {
        login,
        email,
        password,
      },
      httpOptions
    );
  }
}
