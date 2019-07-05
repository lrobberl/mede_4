import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {Data, Linea} from './pedibus.attendance.service';
import {xit} from 'selenium-webdriver/testing';
import * as moment from '../LoginComponent/pedibus.login.component';
import {NewUser} from '../Models/NewUser';
import {User} from '../Models/User';

const REST_URL = 'http://localhost:8080/';


@Injectable()
export class AdminService {

  // newUser: NewUser;

  constructor(private http: HttpClient) {
  }

  registerUser(usrn: string, ruolo: string, linee: string[]): Observable<string | any> {
    console.log('AdminService.registerUser');

    // tslint:disable-next-line:no-shadowed-variable
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const newUser = {
      username: usrn,
      role: ruolo,
      lineeAdminUtente: linee
    };

    const body = JSON.stringify(newUser);

    return this.http.post(REST_URL + 'adminRegister', body, httpOptions).pipe(
      catchError(err => {
        console.error(err);
        return '0';
      })
    );
  }

  getAllUsers(): Observable<User[] | string> {
    return this.http.get<User[]>(REST_URL + 'users').pipe(
      // todo tenere fermate? Il server non le passa
      map(arr => arr.map(x => ({id: x.id, username: x.username,
      firstName: x.firstName, lastName: x.lastName, role: x.role, listaRuoli: x.listaRuoli, status: x.status}) as User)),
      catchError(err => {
        console.error(err);
        return 'Bad Request';
      })
    );
  }
}
