import { Injectable } from '@angular/core';
import { Observable, from, of, pipe } from 'rxjs';
import { map, retry, catchError, tap, first } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface Linea {
  Nome: string;
  fermate: Fermata[];
}

export interface Bambino {
  id: string;
  nome: string;
  presente: boolean;
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
      retry(3),
      catchError(error => of(null))
    );
  }

  getLines(): Observable<Linea[]> {
    console.log('AttendanceService.getLines:');
    return this.http.get<Linea[]>(REST_URL + 'lines').pipe(
      // todo tenere fermate? Il server non le passa
      map(arr => arr.map(x => ({Nome: x.Nome, fermate: x.fermate}) as Linea))
    );
  }

  cambiaStato(bambino: Bambino, line: string, date: Date, direction: string, stop: Fermata) {
    console.log('AttendanceService.cambiaStato:');
    const httpoptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, X-Requested-With, Content-Type, Accept, Origin',
        'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
        'Access-Control-Max-Age': '1728000'
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

    return this.http.put(REST_URL + 'stato/' + bambino.id.toString(), body, httpoptions).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }
}

/*
  getAll(): Observable<Data[]> {
    console.log('httpService.getAll:');
    return this.http.get<Data[]>(REST_URL + 'people/').pipe(
      map(arr => arr.slice(arr.length - 10).map(x => ({name: x.name, id: x.id}) as Data)),
      retry(3),
      catchError(error => of(null))
    );
  }
  addItem(item): Observable<Data> {

    console.log('httpService.addItem: ' + JSON.stringify(item));

    return this.http.post<Data>(
      REST_URL + 'people/', item, httpOptions
    ).pipe(
      first(),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
    // .subscribe( x => { console.log('Post: ' + JSON.stringify(x)); } );
  }
*/
