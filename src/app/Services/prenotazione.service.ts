import { Injectable } from '@angular/core';
import { Observable, from, of, pipe } from 'rxjs';
import { map, retry, catchError, tap, first } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DisponibilitaCorsa} from '../Models/DisponibilitaCorsa';
import {Bambino} from '../Models/Bambino';
import {CorsaWrapper} from '../Models/CorsaWrapper';
import {Linea} from '../Models/Linea';
import {Fermata} from '../Models/Fermata';
import {FermataShort} from '../Models/FermataShort';
import {FermataGroup} from '../Models/FermataGroup';
import {Prenotazione} from '../Models/Prenotazione';
import {RegisterForm} from '../Models/RegisterForm';
import {NewPrenotazione} from '../Models/NewPrenotazione';
import {IdPrenotazione} from '../Models/IdPrenotazione';






const REST_URL = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable()
export class PrenotazioneService {
  constructor(private http: HttpClient) {
  }

  getFermate(): Observable<FermataShort []> {
    console.log('AttendanceService.getFermate:');
    return this.http.get<FermataShort []>(REST_URL + 'fermate').pipe(
      // todo tenere fermate? Il server non le passa
      map(arr => arr.map(x => ({nome: x.nome, id: x.id, linea: x.linea}) as FermataShort))
    );
  }

  getFermateGroupByLinea() {
    console.log('AttendanceService.getFermateLinea');

    return this.http.get<FermataGroup[]>(REST_URL + 'fermateGroupByLinea').pipe(
      map(arr => arr.map(x => ({nome: x.nome, disabled: false, fermate: x.fermate}) as FermataGroup)),
      retry(3)
    );
  }

  getPrenotazioniBambino(id: string) {
    console.log('AttendanceService.getPrenotazioniBambino');

    return this.http.get<Prenotazione[]>(REST_URL + 'reservations/' + id).pipe(
      map(arr => arr.map(x => ({id: x.id, verso: x.verso, fermata: x.fermata,
        data: new Date(x.data), bambino: x.bambino}) as Prenotazione)),
      retry(3)
    );
  }

  prenotaCorsa(idFerm: string, d: Date, idBamb: string, direction: string, linea: string) {
    console.log('PrenotazioneService.prenotaCorsa');

    // tslint:disable-next-line:no-shadowed-variable
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const prenotazione: NewPrenotazione = {
      idBambino: idBamb,
      fermata: idFerm,
      data: d,
      verso: direction
    };

    const body = JSON.stringify(prenotazione);

    return this.http.post<IdPrenotazione>(REST_URL + 'reservations/' + linea + '/' + idFerm, body, httpOptions).pipe(
      map( x => ({
        id: x.id
      }) as IdPrenotazione));
  }

  deletePrenotazione(linea: string, fermata: string, id: string) {
    console.log('AttendanceService.deletePrenotazione');

    return this.http.delete(REST_URL + 'reservations/' + linea + '/' + fermata + '/' + id).pipe(
      retry(3)
    );
  }
}
