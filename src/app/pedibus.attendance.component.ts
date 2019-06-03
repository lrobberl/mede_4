import {Component, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {Bambino, Corsa, HttpService} from './pedibusHTTP.service';
import {Fermata, Persona} from './pedibus.component';
import {Observable} from 'rxjs';

export interface Linea {
  Nome: string;
  fermate: Fermata[];
}

export interface Bambino {
  id: bigint;
  nome: string;
  presente: boolean;
}

export interface Corsa {
  fermate: Fermata[];
  nomeVerso: string;
}

export interface Fermata {
  nome: string;
  orario: string;
  bambini: Bambino[];
}

export interface Data {
  date: Date;
  linea: string;
  corse: Corsa[];
}

@Component({
  selector: 'app-pedibus-attendance',
  templateUrl: './pedibus.attendance.component.html',
  styleUrls: ['./pedibus.attendance.component.css']
})

export class PedibusAttendanceComponent implements OnInit {
  title = 'Esercitazione - #5';
  data$: Observable<Data>;
  selectedDate: string;
  linee$: Observable<Linea[]>;
  item$;


  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.linee$ = this.httpService.getLines();
    const date = new Date();
    this.selectedDate = date.getDay().toString() + date.getMonth().toString() + date.getFullYear().toString();
    this.data$ = this.httpService.getCorsa('Rossa', this.selectedDate);
  }

  getCorsa(linea: string, data: string) {
    this.selectedDate = data;
    this.data$ = this.httpService.getCorsa(linea, data);
  }

  segnaPresente($event: MouseEvent, persona: Bambino) {
    persona.presente = (persona.presente === true) ? false : true;
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


