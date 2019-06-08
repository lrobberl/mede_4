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

export interface User {
  name: string;
  surname: string;
  email: string;
  pass: string;
  pass2: string;
}

@Injectable()
export class UserService {
  user: User;
  constructor(private http: HttpClient) {
  }

  register(firstName: string, lastName: string, mail: string, password: string, password2: string): Observable<User> {
    console.log('UserService.register:');

    const httpoptions = { headers: new HttpHeaders({
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

    return this.http.post<User>(REST_URL + 'register', body, httpoptions).pipe(
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
