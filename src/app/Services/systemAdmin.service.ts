import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {NewUser} from '../Models/NewUser';
import {User} from '../Models/User';

const REST_URL = 'http://localhost:8080/';


@Injectable()
export class SystemAdminService {

  // newUser: NewUser;

  constructor(private http: HttpClient) {
  }

  changeUserRole(usrn: string, ruolo: string) {
    console.log('SystemAdminService.changeUserRole');

    // tslint:disable-next-line:no-shadowed-variable
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const newUser = {
      username: usrn,
      role: ruolo
    };

    const body = JSON.stringify(newUser);

    return this.http.put<any>(REST_URL + 'changeUserRole', body, httpOptions).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }
}
