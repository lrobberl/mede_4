import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatListModule} from '@angular/material/list';
// tslint:disable-next-line:max-line-length
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatOptionModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {MainNavComponent} from './main-nav/main-nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {AttendanceService} from './Services/pedibus.attendance.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {PedibusAttendanceComponent} from './AttendanceComponent/pedibus.attendance.component';
import {PedibusRegisterComponent} from './RegisterComponent/pedibus.register.component';
import {PedibusLoginComponent} from './LoginComponent/pedibus.login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {UserService} from './Services/pedibus.user.service';
import {AuthInterceptor} from './Services/pedibus.authInterceptor.service';
import {AuthGuard} from './Services/auth.guard';
import {HomeComponent} from './HomeComponent/home.component';
import {AdminRegisterComponent} from './AdminRegisterComponent/admin.register.component';
import {AdminService} from './Services/admin.service';
import {Role} from './Models/Role';
import {NotFoundComponent} from './NotFoundComponent/notFound.component';
import {UserListComponent} from './AdminUserListComponent/user.list.component';
import {ChangeRoleComponent} from './AdminChangeRoleComponent/admin.change.role.component';
import {SystemAdminService} from './Services/systemAdmin.service';
import {RecoverPasswordComponent} from './RecoverPasswordComponent/recoverPassword.component';
import {ResetPasswordComponent} from './ResetPasswordComponent/resetPassword.component';

const appRoutes: Routes = [
  { path: 'confirm/:uuid', component: PedibusRegisterComponent},
  { path: 'attendance', component: PedibusAttendanceComponent, canActivate: [AuthGuard]},
  { path: 'login', component: PedibusLoginComponent},
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'adminRegister', component: AdminRegisterComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.SystemAdmin] } },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.SystemAdmin] }},
  { path: 'changeUserRole', component: ChangeRoleComponent, canActivate: [AuthGuard], data: { roles: [Role.SystemAdmin] }},
  { path: 'recoverPassword', component: RecoverPasswordComponent},
  { path: 'resetPassword/:uuid', component: ResetPasswordComponent},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    PedibusAttendanceComponent,
    MainNavComponent,
    PedibusRegisterComponent,
    PedibusLoginComponent,
    HomeComponent,
    AdminRegisterComponent,
    UserListComponent,
    ChangeRoleComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
    NotFoundComponent
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
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule
  ],
  providers: [UserService, AttendanceService, AdminService, SystemAdminService,
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {}
