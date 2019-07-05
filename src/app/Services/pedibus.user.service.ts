import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {Data, FermataShort} from './pedibus.attendance.service';
import {xit} from 'selenium-webdriver/testing';
import * as moment from '../LoginComponent/pedibus.login.component';
import {Message} from '../Models/Message';
import {User} from '../Models/User';
import {forEach} from '@angular/router/src/utils/collection';

const REST_URL = 'http://localhost:8080/';

export interface RegisterForm {
  name: string;
  surname: string;
  email: string;
  pass: string;
  pass2: string;
  fermataDefault: string;
  lineaDefault: string;
  figli: BambinoRegistration[];
}

export interface TokenData {
  id_token: string;
}

export interface BambinoRegistration {
  nome: string;
  cognome: string;
  fermataDefault: string;
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
  register(firstName: string, lastName: string, mail: string, password: string, password2: string,
           fermataDef: string, lineaDef: string, figliArray: BambinoRegistration[], uuid: string): Observable<RegisterForm | string> {
    console.log('UserService.register');

    // tslint:disable-next-line:no-shadowed-variable
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    /*
    const listaBambini: BambinoRegistration[] = [];

    figliArray.forEach( value => {
      const tmp: BambinoRegistration = {
        nome: value.nome,
        cognome: value.cognome,
        fermataDefault: value.fermataDefault
      };
      listaBambini.push(tmp);
    });
     */

    this.user = {
      name: firstName,
      surname: lastName,
      email: mail,
      pass: password,
      pass2: password2,
      fermataDefault: fermataDef,
      lineaDefault: lineaDef,
      figli: figliArray
  };

    const body = JSON.stringify(this.user);

    return this.http.post<RegisterForm>(REST_URL + 'confirm/' + uuid, body, httpOptions);
  }
  /*
  .pipe(
      catchError(err => {
        console.error(err);
        return '0';
      })
    )
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

    return this.http.post(REST_URL + 'recover', body, httpOptions);
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

    return this.http.post<string>(REST_URL + 'recover/' + uuid, body, httpOptions);
  }

  getAllMessages(): Observable<Message [] | string> {
    console.log('UserService.getAllMessages');

    return this.http.get<Message []>(REST_URL + 'comunicazioni');
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

  segnaMessaggioLetto(element: Message) {
    console.log('UserService.segnaMessaggioLetto');

    const httpOptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const bodyObj = {
      id: element.id,
    };

    const body = JSON.stringify(bodyObj);

    return this.http.put<string>(REST_URL + 'comunicazioni', body, httpOptions);
  }
}
