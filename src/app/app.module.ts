import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatListModule } from '@angular/material/list';
// tslint:disable-next-line:max-line-length
import {MatCardModule, MatIconModule, MatPaginatorModule, MatRadioModule, MatToolbarModule, MatButtonModule, MatSidenavModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {HttpService} from './pedibusHTTP.service';
import {HttpClientModule} from '@angular/common/http';
import {PedibusAttendanceComponent} from './pedibus.attendance.component';
import {PedibusRegisterComponent} from './pedibus.register.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  { path: 'register', component: PedibusRegisterComponent },
  { path: 'attendance', component: PedibusAttendanceComponent},
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PedibusAttendanceComponent,
    MainNavComponent,
    PedibusRegisterComponent
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
    RouterModule.forRoot(appRoutes, { enableTracing: true })
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
