import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {Data} from './pedibus.attendance.service';
import {xit} from 'selenium-webdriver/testing';
import * as moment from '../LoginComponent/pedibus.login.component';

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
    console.log('UserService.register:');

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

  checkEmailPresent(email: string): Observable<CheckEmailPresent> {
    console.log('UserService.checkEmailPresent:');
    return this.http.get(REST_URL + 'presence/' + email).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }
  // todo: inserire anche il controllo sulla validità del token (expiration date)
  public isLoggedIn() {
    return localStorage.getItem('id_token') !== null;
  }
/*
  isLoggedOut() {
    return !this.isLoggedIn();
  }
*/
}
