import { Injectable } from '@angular/core';
import { Observable, from, of, pipe } from 'rxjs';
import { map, retry, catchError, tap, first } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DisponibilitaCorsa} from '../Models/DisponibilitaCorsa';

export interface Linea {
  id: string;
  nome: string;
  aaccompagnatori: string[];
  fermate: Fermata[];
}

export interface Bambino {
  id: string;
  nome: string;
  presente: boolean;
  prenotato: boolean;
}

export interface Corsa {
  fermate: Fermata[];
  nomeverso: string;
}

export interface Fermata {
  id: string;
  nome: string;
  orario: string;
  bambini: Bambino[];
}

export interface FermataShort {
  id: string;
  nome: string;
  linea: string;
}

export interface Data {
  date: Date;
  linea: string;
  corse: Corsa[];
}

const REST_URL = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

// TODO: var date = new Date(UNIX_Timestamp * 1000); conversione da epoca UNIX a oggetto Date. Poi da convertire al formato 'dd-mm-aaaa'
@Injectable()
export class AttendanceService {
  constructor(private http: HttpClient) {
  }

  // Get di una singola corsa dal server
  getCorsa(linea: string, data: string): Observable<Data> {
    console.log('AttendanceService.getCorsa:');
    return this.http.get<Data>(REST_URL + 'corsa/' + linea + '/' + data).pipe(
      map(x => ({date: new Date(x.date), linea: x.linea, corse: x.corse}) as Data),
      retry(3)
    );
  }

  getLines(): Observable<Linea[]> {
    console.log('AttendanceService.getLines:');
    return this.http.get<Linea[]>(REST_URL + 'lines');
  }

  cambiaStato(bambino: Bambino, line: string, date: Date, direction: string, stop: Fermata) {
    console.log('AttendanceService.cambiaStato:');
    const httpoptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const bodyObj = {
      linea: line,
      orario: stop.orario,
      data: date,
      fermata: stop.nome,
      verso: direction
    };

    const body = JSON.stringify(bodyObj);

    return this.http.put(REST_URL + 'stato/' + bambino.id.toString(), body, httpoptions);
  }

  getFermate(): Observable<FermataShort [] | string> {
    console.log('AttendanceService.getFermate:');
    return this.http.get<FermataShort []>(REST_URL + 'fermate').pipe(
      // todo tenere fermate? Il server non le passa
      map(arr => arr.map(x => ({nome: x.nome, id: x.id, linea: x.linea}) as FermataShort)),
      catchError(err => {
        console.error(err);
        return '0';
      })
    );
  }

  getAccompagnatori(linea: string, dataSelezionata: string) {
    console.log('AttendanceService.getDisponibilitaCorsa');
    return this.http.get<DisponibilitaCorsa>(REST_URL + 'disponibilita/' + linea + '/' + dataSelezionata).pipe(
      map(x => ({date: new Date(x.date), linea: x.linea, accompagnatoriAndata: x.accompagnatoriAndata,
                        accompagnatoriRitorno: x.accompagnatoriRitorno, chiusoRitorno: x.chiusoRitorno,
                        chiusoAndata: x.chiusoAndata, idAndata: x.idAndata, idRitorno: x.idRitorno}) as DisponibilitaCorsa),
      retry(3)
    );
  }

  consolidaTurno(line: string, date: string, direction: string, accomp: Array<string>) {
    console.log('AttendanceService.consolidaTurno' + direction);

    const httpoptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const bodyObj = {
      emailAccompagnatori: accomp
    };

    const body = JSON.stringify(bodyObj);

    return this.http.put(REST_URL + 'turno/' + line + '/' + date + '/' + direction , body, httpoptions);
  }

  riapriTurno(id: string) {
    console.log('AttendanceService.riapriTurno:');
    const httpoptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const bodyObj = {
      idCorsa: id
    };

    const body = JSON.stringify(bodyObj);

    return this.http.put(REST_URL + 'riapri-turno', body, httpoptions);
  }
}
