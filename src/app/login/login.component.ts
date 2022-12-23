import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../services/token-storage.service";
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  flag: boolean = true;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role: string | undefined;


  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.role = this.tokenStorage.getUser().role;
    }
  }

  onSubmit(): void {
    this.authService.login(this.form.controls['login'].value,
      this.form.controls['password'].value).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.jwt);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.role = this.tokenStorage.getUser().role;
        this.redirectPage();
      },
      error: err => {
        this.errorMessage = err.message;
        this.isLoginFailed = true;
      }
    });
  }

  redirectPage(): void {
    window.location.href="/";
  }
}
