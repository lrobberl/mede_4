import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
// tslint:disable-next-line:max-line-length
import {
  MatCardModule,
  MatIconModule,
  MatPaginatorModule,
  MatRadioModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule, MatInputModule
} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {AttendanceService} from './pedibus.attendance.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {PedibusAttendanceComponent} from './AttendanceComponent/pedibus.attendance.component';
import {PedibusRegisterComponent} from './RegisterComponent/pedibus.register.component';
import {PedibusLoginComponent} from './LoginComponent/pedibus.login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {UserService} from './pedibus.user.service';
import {AuthInterceptor} from './pedibus.authInterceptor.service';

const appRoutes: Routes = [
  { path: 'register', component: PedibusRegisterComponent },
  { path: 'attendance', component: PedibusAttendanceComponent},
  { path: 'login', component: PedibusLoginComponent},
  // { path: 'login', component: PedibusAttendanceComponent},
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PedibusAttendanceComponent,
    MainNavComponent,
    PedibusRegisterComponent,
    PedibusLoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatPaginatorModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {enableTracing: true}),
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [UserService, AttendanceService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {}
