import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';

const REST_URL = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  register(firstName: string, lastName: string, mail: string, pass: string, pass2: string) {
    console.log('UserService.register:');

    const httpoptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, X-Requested-With, Content-Type, Accept, Origin',
        'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
        'Access-Control-Max-Age': '1728000'
      })
    };

    const bodyObj = {
      nome: firstName,
      cognome: lastName,
      email: mail,
      password: pass,
      password2: pass2,
    };

    const body = JSON.stringify(bodyObj);

    return this.http.post(REST_URL + 'register', body, httpoptions).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }

  login(mail: string, pass: string) {
    console.log('UserService.login:');

    const httpoptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, X-Requested-With, Content-Type, Accept, Origin',
        'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
        'Access-Control-Max-Age': '1728000'
      })
    };

    const bodyObj = {
      email: mail,
      password: pass,
    };

    const body = JSON.stringify(bodyObj);

    return this.http.post(REST_URL + 'login', body, httpoptions).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }
}
