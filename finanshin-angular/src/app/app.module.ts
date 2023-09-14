import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { IncomePageComponent } from './components/income-page/income-page.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddIncomeComponent } from './components/add-income/add-income.component';
import { UpdateIncomeComponent } from './components/update-income/update-income.component';

const routes: Routes = [
  { path: 'incomes', component: IncomePageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    NavBarComponent,
    HeaderComponent,
    IncomePageComponent,
    AddIncomeComponent,
    UpdateIncomeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule.forRoot(environment.auth0),
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
