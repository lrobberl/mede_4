import { Injectable } from '@angular/core';
import { Observable, from, of, pipe } from 'rxjs';
import { map, retry, catchError, tap, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface Bambino {
  id: bigint;
  nome: string;
  presente: boolean;
}

export interface Verso {
  fermate: Fermata[];
  nomeVerso: string;
}

export interface Fermata {
  nome: string;
  orario: string;
  bambini: Bambino[];
}

interface Data {
  date: Date;
  linea: string;
  versi: Verso[];
}
/*
const DATA: Data[] = [
  { id: 1, name: 'Luke' },
  { id: 2, name: 'Obiwan' }
];
*/
const REST_URL = 'http://localhost:8080/';

import { HttpHeaders } from '@angular/common/http';
import {Fermata, Persona} from './pedibus.attendance.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};


@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {
  }

  getCorsa(linea: string, data: string): Observable<Data> {
    console.log('httpService.getCorsa:');
    return this.http.get<Data>(REST_URL + '/corsa/' + linea + '/' + data).pipe(
      map(x => ({date: x.date, linea: x.linea, versi: x.versi}) as Data),
      retry(3),
      catchError(error => of(null))
    );
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

}
