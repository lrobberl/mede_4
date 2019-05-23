import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MatListModule } from '@angular/material/list';
import {MatCardModule, MatIconModule, MatPaginatorModule, MatRadioModule} from '@angular/material';
import {PedibusComponent} from './pedibus.component';


@NgModule({
  declarations: [
    PedibusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatListModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [PedibusComponent]
})
export class AppModule { }
