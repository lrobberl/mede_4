import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {Data} from './pedibus.attendance.service';
import {xit} from 'selenium-webdriver/testing';
import * as moment from '../LoginComponent/pedibus.login.component';

const REST_URL = 'http://localhost:8080/';


@Injectable()
export class AdminService {

  constructor(private http: HttpClient) {
  }

  registerUser(username: string, role: string) {
    console.log('UserService.register:');

    // tslint:disable-next-line:no-shadowed-variable
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    /*
    this.user = {
      name: firstName,
      surname: lastName,
      email: mail,
      pass: password,
      pass2: password2
    };
    const body = JSON.stringify(this.user);

    return this.http.post<RegisterForm>(REST_URL + 'register', body, httpOptions).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  */
  }
}
