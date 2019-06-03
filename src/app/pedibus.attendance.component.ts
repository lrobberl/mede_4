import {Component, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import { HttpService } from './pedibusHTTP.service';


@Component({
  selector: 'app-pedibus-attendance',
  templateUrl: './pedibus.component.html',
  styleUrls: ['./pedibus.component.css']
})

export class PedibusAttendanceComponent implements OnInit {
  title = 'Esercitazione - #5';
  data$;
  item$;

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    const date = new Date();
    this.data$ = this.httpService.getCorsa('rossa', date.getDay().toString() + date.getMonth().toString() + date.getFullYear().toString());
  }

  getCorsa(linea: string, data: string) {
    this.data$ = this.httpService.getCorsa(linea, data);
  }



  /*getAll() {
    this.data$ = this.service.getAll();
  }

  addItem(item) {
    console.log(item.value);
    this.item$ = this.service.addItem({name: item.value})
    // .subscribe( () => this.getAll() ) // remove async pipe from code
    ;
  }*/



}


