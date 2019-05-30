import {Component, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import { HttpService } from './pedibus.HttpService';

export interface Linea {
  nome: string;
  fermate: Fermata[];
}

export interface Fermata {
  nome: string;
  orario: string;
  persone: Persona[];
}

export interface Giorno {
  data: Date;
  linee: Linea[];
}

export interface Persona {
  nome: string;
  presente: boolean;
}

@Component({
  selector: 'app-pedibus',
  templateUrl: './pedibus.component.html',
  styleUrls: ['./pedibus.component.css']
})

export class PedibusAttendanceComponent implements OnInit {
  title = 'Esercitazione - #5';
  data$;
  item$;

  constructor(private service: HttpService) {
  }

  ngOnInit() {
    const date = new Date();
    this.data$ = this.service.getCorsa('rossa', date.getDay().toString() + date.getMonth().toString() + date.getFullYear().toString());
  }
/*
  getCorsa() {
    this.data$ = this.service.getCorsa();
  }
*/



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


