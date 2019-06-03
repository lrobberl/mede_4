import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MatListModule } from '@angular/material/list';
// tslint:disable-next-line:max-line-length
import {MatCardModule, MatIconModule, MatPaginatorModule, MatRadioModule, MatToolbarModule, MatButtonModule, MatSidenavModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PedibusComponent} from './pedibus.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {HttpService} from './pedibusHTTP.service';
import {HttpClientModule} from '@angular/common/http';
import {PedibusAttendanceComponent} from './pedibus.attendance.component';
import {PedibusRegistrationComponent} from './pedibus.registration.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    PedibusComponent,
    PedibusAttendanceComponent,
    MainNavComponent,
    PedibusRegistrationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatListModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatPaginatorModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [HttpService],
  bootstrap: [PedibusComponent, PedibusAttendanceComponent, PedibusRegistrationComponent]
})
export class AppModule { }
