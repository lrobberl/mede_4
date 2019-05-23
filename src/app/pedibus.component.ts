import {Component, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';

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
              persone: [
                {
                  nome: 'Zebedeo',
                  presente: false
                },
                {
                  nome: 'Gesualdo',
                  presente: false
                },
                {
                  nome: 'Anita',
                  presente: false
                }
              ]
            },
            {
              nome: 'Corso Einaudi',
              orario: '7:35',
              persone: [
                {
                  nome: 'Martin',
                  presente: false
                }
              ]
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: [
                {
                  nome: 'Miguel',
                  presente: false
                }
              ]
            },
          ]
        },
        {
          nome: 'blu',
          fermate: [
            {
              nome: 'Piazza Vittorio',
              orario: '7:20',
              persone: [
                {
                  nome: 'Peppina',
                  presente: false
                }
              ]
            },
            {
              nome: 'Piazza San Carlo',
              orario: '7:35',
              persone: []
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: [
                {
                  nome: 'Michelangelo',
                  presente: false
                }
              ]
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
              persone: [
                {
                  nome: 'Lucio',
                  presente: false
                }
              ]
            },
            {
              nome: 'Corso Einaudi',
              orario: '7:35',
              persone: []
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: [
                {
                  nome: 'Gaia',
                  presente: false
                }
              ]
            },
          ]
        },
        {
          nome: 'blu',
          fermate: [
            {
              nome: 'Piazza Vittorio',
              orario: '7:20',
              persone: [
                {
                  nome: 'Ahmed',
                  presente: false
                }
              ]
            },
            {
              nome: 'Piazza San Carlo',
              orario: '7:35',
              persone: [
                {
                  nome: 'Mohamed',
                  presente: false
                }
              ]
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: [
                {
                  nome: 'El Khabir',
                  presente: false
                }
              ]
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
              persone: [
                {
                  nome: 'Monica',
                  presente: false
                }
              ]
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
              persone: [
                {
                  nome: 'Zac',
                  presente: false
                }
              ]
            },
            {
              nome: 'Piazza San Carlo',
              orario: '7:35',
              persone: []
            },
            {
              nome: 'Politecnico',
              orario: '7:55',
              persone: [
                {
                  nome: 'Mike',
                  presente: false
                }
              ]
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

  segnaPresente($event: MouseEvent, persona: Persona) {
    persona.presente = (persona.presente === true) ? false : true;
  }

  getPersone(persone: Persona[]) {
    return persone.sort((a, b) => (a.nome > b.nome) ? 1 : -1 );
  }
}
