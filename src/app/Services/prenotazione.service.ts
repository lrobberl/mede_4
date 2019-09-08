import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map, retry} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Linea} from '../Models/Linea';
import {FermataShort} from '../Models/FermataShort';
import {FermataGroup} from '../Models/FermataGroup';
import {Prenotazione} from '../Models/Prenotazione';
import {NewPrenotazione} from '../Models/NewPrenotazione';
import {IdPrenotazione} from '../Models/IdPrenotazione';
import {Disponibilita} from '../Models/Disponibilita';
import {NewDisponibilita} from '../Models/NewDisponibilita';

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
    console.log('AttendanceService.getFermateGroupByLinea');

    return this.http.get<FermataGroup[]>(REST_URL + 'fermateGroupByLinea').pipe(
      map(arr => arr.map(x => ({nome: x.nome, disabled: false, fermate: x.fermate}) as FermataGroup)),
      retry(3)
    );
  }

  getFermateOfLinea(linea: string) {
    console.log('AttendanceService.getFermateOfLinea');

    return this.http.get<FermataShort[]>(REST_URL + 'fermate/' + linea).pipe(
      map(arr => arr.map(x => ({nome: x.nome, id: x.id}) as FermataShort)),
      retry(3)
    );
  }

  getFermateGroupByLineaWithScuola() {
    console.log('AttendanceService.getFermateGroupByLineaWithScuola');

    return this.http.get<FermataGroup[]>(REST_URL + 'fermateGroupByLineaWithScuola').pipe(
      map(arr => arr.map(x => ({nome: x.nome, disabled: false, fermate: x.fermate}) as FermataGroup)),
      retry(3)
    );
  }

  getLineeAccompagnatore() {
    console.log('AttendanceService.getLineeAccompagnatore');

    return this.http.get<Linea[]>(REST_URL + 'linee-accompagnatore').pipe(
      map(arr => arr.map(x => ({nome: x.nome, id: x.id, aaccompagnatori: [], fermate: []}) as Linea)),
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

  getDisponibilitaAccompagnatore(linea: string) {
    console.log('AttendanceService.getDisponibilitaAccompagnatore');

    return this.http.get<Disponibilita[]>(REST_URL + 'disponibilita-accompagnatore/' + linea);
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

  prenotaDisponibilita(fermataID: string, d: Date, direction: string, line: string) {
    console.log('PrenotazioneService.prenotaCorsa');

    // tslint:disable-next-line:no-shadowed-variable
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const prenotazione: NewDisponibilita = {
      linea: line,
      data: d,
      verso: direction,
      idFermata: fermataID
    };

    const body = JSON.stringify(prenotazione);

    return this.http.post<IdPrenotazione>(REST_URL + 'disponibilita', body, httpOptions);
  }

  deletePrenotazione(linea: string, fermata: string, id: string) {
    console.log('AttendanceService.deletePrenotazione');

    return this.http.delete(REST_URL + 'reservations/' + linea + '/' + fermata + '/' + id);
  }

  deleteDisponibilita(linea: string, data: string, verso: string) {
    console.log('AttendanceService.deletePrenotazione');

    return this.http.delete(REST_URL + 'disponibilita/' + linea + '/' + data + '/' + verso);
  }
}
