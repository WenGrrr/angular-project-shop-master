import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {BuyerComponent} from './buyer/buyer.component';
import {ProductComponent} from './product/product.component';
import {SellerComponent} from './seller/seller.component';
import {ProfileComponent} from './profile/profile.component';
import {httpInterceptorProviders} from "./helpers/http.interceptor";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import { ProductDialogComponent } from './product/product-dialog/product-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {BuyerDialogComponent} from "./buyer/buyer-dialog/buyer-dialog.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MY_DATE_FORMATS} from "./helpers/my-date-formats";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import { SellerDialogComponent } from './seller/seller-dialog/seller-dialog.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersDialogComponent } from './orders/orders-dialog/orders-dialog.component';
import { ProductPipePipe } from './orders/pipes/product-pipe.pipe';
import { SellerPipePipe } from './orders/pipes/seller-pipe.pipe';
import { RateComponent } from './rate/rate.component';
import { RateDialogComponent } from './rate/rate-dialog/rate-dialog.component';
import { BuyerPipePipe } from './rate/pipes/buyer-pipe.pipe';

registerLocaleData(ru);

// определение маршрутов
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'product', component: ProductComponent},
  {path: 'buyer', component: BuyerComponent},
  {path: 'seller', component: SellerComponent},
  {path: 'orders', component: OrdersComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [//классы представлений (view classes), которые принадлежат модулю. Angular имеет три типа классов представлений: компоненты (components), директивы (directives), каналы (pipes)
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    BuyerComponent,
    ProductComponent,
    SellerComponent,
    ProfileComponent,
    ProductDialogComponent,
    BuyerDialogComponent,
    SellerDialogComponent,
    OrdersComponent,
    OrdersDialogComponent,
    ProductPipePipe,
    SellerPipePipe,
    RateComponent,
    RateDialogComponent,
    BuyerPipePipe
  ],
  imports: [//другие модули, классы которых необходимы для шаблонов компонентов из текущего модуля
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule
  ],
  providers: [httpInterceptorProviders,
    {provide: MAT_DATE_LOCALE, useValue: 'ru'},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]}],//классы, создающие сервисы, используемые модулем
  bootstrap: [AppComponent]//корневой компонент, который вызывается по умолчанию при загрузке приложения
})
export class AppModule {
}
