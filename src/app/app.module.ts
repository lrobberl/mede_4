import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MatListModule } from '@angular/material/list';
import {MatCardModule, MatIconModule, MatPaginatorModule, MatRadioModule, MatToolbarModule, MatButtonModule, MatSidenavModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PedibusComponent} from './pedibus.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {httpService} from './pedibus.HttpService';
import {HttpClientModule} from '@angular/common/http';
import {PedibusAttendanceComponent} from './pedibus.attendance.component';


@NgModule({
  declarations: [
    PedibusComponent,
    PedibusAttendanceComponent,
    MainNavComponent
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
    HttpClientModule
  ],
  providers: [httpService],
  bootstrap: [PedibusComponent, PedibusAttendanceComponent]
})
export class AppModule { }
