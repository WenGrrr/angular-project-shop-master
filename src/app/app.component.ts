import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "./services/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private role: string = '';
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  login?: string;

  constructor(private tokenStorageService: TokenStorageService) {
    //window["apiUrl"] = environment.production? "": "http://localhost:8080";
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;

      this.showAdminBoard = this.role.includes('ROLE_ADMIN');
      this.showUserBoard = this.role.includes('ROLE_USER');

      this.login = user.login;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
