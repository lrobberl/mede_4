import {Component, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';

export interface Linea {
  nome: string;
  fermate: Fermata[];
}

export interface Fermata {
  nome: string;
  orario: string;
  persone: string[];
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

export class PedibusComponent implements OnInit {
  public title: string;
  curGiorno: number;
  curLinea: number;
  giornoSelezionato: Giorno;
  lineaSelezionata: Linea;
  giorni: Giorno[] = [
    {
      data: new Date(2019, 2, 13),
      linee: [
        {
          nome: 'rossa',
          fermate: [
            {
              nome: 'Sabotino',
              orario: '7:20',
              persone: ['Zebedeo', 'Gesualdo', 'Peppina']
            },
            {
              nome: 'Corso Einaudi',
              orario: '7:35',
              persone: ['Martin']
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: ['Miguel']
            },
          ]
        },
        {
          nome: 'blu',
          fermate: [
            {
              nome: 'Piazza Vittorio',
              orario: '7:20',
              persone: ['Peppina']
            },
            {
              nome: 'Piazza San Carlo',
              orario: '7:35',
              persone: []
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: ['Mike']
            },
          ]
        }
      ]
    },
    {
      data: new Date(2019, 2, 15),
      linee: [
        {
          nome: 'rossa',
          fermate: [
            {
              nome: 'Sabotino',
              orario: '7:20',
              persone: ['Lucio']
            },
            {
              nome: 'Corso Einaudi',
              orario: '7:35',
              persone: []
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: ['Gaia']
            },
          ]
        },
        {
          nome: 'blu',
          fermate: [
            {
              nome: 'Piazza Vittorio',
              orario: '7:20',
              persone: ['Ahmed']
            },
            {
              nome: 'Piazza San Carlo',
              orario: '7:35',
              persone: ['Mohamed']
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: ['El khabir']
            },
          ]
        }
      ]
    },
    {
      data: new Date(2019, 2, 17),
      linee: [
        {
          nome: 'rossa',
          fermate: [
            {
              nome: 'Sabotino',
              orario: '7:20',
              persone: []
            },
            {
              nome: 'Corso Einaudi',
              orario: '7:35',
              persone: ['Monica']
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: []
            },
          ]
        },
        {
          nome: 'blu',
          fermate: [
            {
              nome: 'Piazza Vittorio',
              orario: '7:20',
              persone: ['Zac']
            },
            {
              nome: 'Piazza San Carlo',
              orario: '7:35',
              persone: []
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: ['Mike']
            },
          ]
        }
      ]
    }
  ];

  constructor() {
    this.curGiorno = 0;
    this.curLinea = 0;
    this.title = 'Esercitazione - #4';
  }

  ngOnInit(): void {
    this.curGiorno = 0;
    this.curLinea = 0;
    this.giornoSelezionato = this.giorni[this.curGiorno];
    this.lineaSelezionata = this.giorni[this.curGiorno].linee[this.curLinea];
  }

  nextDay() {
    this.curGiorno = (this.curGiorno === this.giorni.length - 1) ? this.curGiorno : this.curGiorno + 1;
    this.giornoSelezionato = this.giorni[this.curGiorno];
    this.lineaSelezionata = this.giorni[this.curGiorno].linee[this.curLinea];
  }

  previousDay() {
    this.curGiorno = (this.curGiorno === 0) ? this.curGiorno : this.curGiorno - 1;
    this.giornoSelezionato = this.giorni[this.curGiorno];
    this.lineaSelezionata = this.giorni[this.curGiorno].linee[this.curLinea];
  }

  cambiaLinea($event: MatRadioChange) {
    this.curLinea = $event.value;
    this.lineaSelezionata = this.giorni[this.curGiorno].linee[this.curLinea];
  }

  pageChangeEvent($event: PageEvent) {
    ($event.pageIndex - $event.previousPageIndex > 0) ? this.nextDay() : this.previousDay();
  }
}
