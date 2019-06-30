import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {Data} from './pedibus.attendance.service';
import {xit} from 'selenium-webdriver/testing';
import * as moment from '../LoginComponent/pedibus.login.component';
import {Message} from '../Models/Message';
import {User} from '../Models/User';

const REST_URL = 'http://localhost:8080/';

export interface RegisterForm {
  name: string;
  surname: string;
  email: string;
  pass: string;
  pass2: string;
}

export interface TokenData {
  id_token: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface CheckEmailPresent {
  presente: string;
}

@Injectable()
export class UserService {
  user: RegisterForm;
  userLogged: string;

  constructor(private http: HttpClient) {
  }

  // Todo: verificare cosa ritorna il Server dopo aver effettuato la registrazione
  register(firstName: string, lastName: string, mail: string, password: string, password2: string, uuid: string): Observable<RegisterForm> {
    console.log('UserService.register');

    // tslint:disable-next-line:no-shadowed-variable
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    this.user = {
      name: firstName,
      surname: lastName,
      email: mail,
      pass: password,
      pass2: password2
  };
    const body = JSON.stringify(this.user);

    return this.http.post<RegisterForm>(REST_URL + 'confirm/' + uuid, body, httpOptions).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }
  /*
  login(mail: string, pass: string): Observable<string> {
    console.log('UserService.login:');

    const httpOptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const bodyObj = {
      username: mail,
      password: pass,
    };

    const body = JSON.stringify(bodyObj);

    localStorage.setItem('user', mail);

    return this.http.post<TokenData>(REST_URL + 'login', body, httpOptions).pipe(
      map(x => {
        return x.id_token;
      }),
      catchError(err => {
        console.error(err);
        localStorage.setItem('user', 'Not logged');
        return of(null);
      })
    );
  }


  logout() {
    localStorage.removeItem('id_token');
    localStorage.setItem('user', 'Not logged');
  }
  */

  checkEmailPresent(email: string): Observable<CheckEmailPresent> {
    console.log('UserService.checkEmailPresent');
    return this.http.get(REST_URL + 'presence/' + email).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }

  recoverPassword(mail: string) {
    console.log('UserService.recoverPassword');

    const httpOptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const bodyObj = {
      username: mail,
    };

    const body = JSON.stringify(bodyObj);

    return this.http.post(REST_URL + 'recover', body, httpOptions).pipe(
      catchError(err => {
        console.error(err);
        return 'Bad Request';
      })
    );
    /*.pipe(
      map(x => {

        return ;
      }),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
     */
  }

  resetPassword(p1: string, p2: string, uuid: string) {
    console.log('UserService.resetPassword');

    // todo: Controllo se c'è il token nel localstorage?
    const httpOptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const bodyObj = {
      pass: p1,
      pass2: p2
    };

    const body = JSON.stringify(bodyObj);

    return this.http.post<string>(REST_URL + 'recover/' + uuid, body, httpOptions).pipe(
      catchError(err => {
        console.error(err);
        return 'Bad Request';
      })
    );
  }

  getAllMessages(): Observable<Message [] | string> {
    console.log('UserService.getAllMessages');

    return this.http.get<Message []>(REST_URL + 'comunicazioni').pipe(
      catchError(err => {
        console.error(err);
        return 'Bad Request';
      })
    );
  }
  // Get from the server the number of incoming messages for a certain USER specified in the URL path
  getNumberNewMessages(user: string): Observable<number | string> {
    console.log('UserService.getNumberNewMessages');

    return this.http.get<number>(REST_URL + 'comunicazioni/' + user).pipe(
      catchError(err => {
        console.error(err);
        return 'Bad Request';
      })
    );
  }
}
