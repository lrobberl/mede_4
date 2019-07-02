import {Injectable} from '@angular/core';
import {Observable, of, BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {TokenData} from './pedibus.user.service';
import {User} from '../Models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Role} from '../Models/Role';

const REST_URL = 'http://localhost:8080/';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public error = '';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(mail: string, pass: string): Observable<User |string> {
    console.log('UserService.login:');

    const httpOptions = { headers: new HttpHeaders({
        'Content-Type':  'application/json',
        observe: 'response'
      })
    };

    const bodyObj = {
      username: mail,
      password: pass,
    };

    const body = JSON.stringify(bodyObj);

    return this.http.post<User>(REST_URL + 'login', body, httpOptions).pipe(
      map(response => {
        // console.log(response, response.ok, response.status, response.type, response.headers);
        if (response && response.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
            return response;
          } else {
            return 'Bad Request';
          }
        }),
      catchError(err => {
        console.error(err);
        return 'Bad Request';
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn() {
    const curUser = this.currentUserSubject.value;

    if (!curUser || (!curUser.listaRuoli.includes(Role.Accompagnatore) && !curUser.listaRuoli.includes(Role.User)
          && !curUser.listaRuoli.includes(Role.SystemAdmin))) {
      return false;
    } else { // return this.checkTokenvalidity(curUser.token);
      return true; }
  }

  // todo: NON VA - da controllare!
  checkTokenvalidity(token: string): boolean {
    const helper = new JwtHelperService();
    return helper.isTokenExpired(token);
  }
}


