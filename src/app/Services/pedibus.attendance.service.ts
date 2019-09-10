import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map, retry} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DisponibilitaCorsa} from '../Models/DisponibilitaCorsa';
import {Bambino} from '../Models/Bambino';
import {CorsaWrapper} from '../Models/CorsaWrapper';
import {Linea} from '../Models/Linea';
import {Fermata} from '../Models/Fermata';
import {FermataShort} from '../Models/FermataShort';
import {FermataGroup} from '../Models/FermataGroup';
import {Prenotazione} from '../Models/Prenotazione';
import {AccompagnatoreFermata} from '../Models/AccompagnatoreFermata';

const REST_URL = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

// var date = new Date(UNIX_Timestamp * 1000); conversione da epoca UNIX a oggetto Date. Poi da convertire al formato 'dd-mm-aaaa'
@Injectable()
export class AttendanceService {
  constructor(private http: HttpClient) {
  }

  // Get di una singola corsa dal server
  getCorsa(linea: string, data: string): Observable<CorsaWrapper> {
    console.log('AttendanceService.getCorsa:');
    return this.http.get<CorsaWrapper>(REST_URL + 'corsa/' + linea + '/' + data).pipe(
      map(x => ({date: new Date(x.date), linea: x.linea, corse: x.corse}) as CorsaWrapper),
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

  getFermate(): Observable<FermataShort []> {
    console.log('AttendanceService.getFermate:');
    return this.http.get<FermataShort []>(REST_URL + 'fermate').pipe(

      map(arr => arr.map(x => ({nome: x.nome, id: x.id, linea: x.linea}) as FermataShort))
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

  consolidaTurno(line: string, date: string, direction: string, accomp: AccompagnatoreFermata) {
    console.log('AttendanceService.consolidaTurno' + direction);

    const httpoptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const bodyObj = {
      email: accomp.email,
      idFermata: accomp.idFermata
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
              data: new Date(x.data)}) as Prenotazione)),
      retry(3)
    );
  }
}
