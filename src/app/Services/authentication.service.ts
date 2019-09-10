import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../Models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Role} from '../Models/Role';
import {WebSocketService} from './websocket.service';

const REST_URL = 'http://localhost:8080/';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public error = '';

  constructor(private http: HttpClient,
              private websocketService: WebSocketService) {
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
        if (response && response.token) {
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
            return response;
          }
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.websocketService.disconnect();
  }

  isLoggedIn() {
    const curUser = this.currentUserSubject.value;

    if (!curUser || (!curUser.listaRuoli.includes(Role.Accompagnatore) && !curUser.listaRuoli.includes(Role.User)
          && !curUser.listaRuoli.includes(Role.SystemAdmin))) {
      return false;
    } else {
      return true; }
  }


  checkTokenvalidity(token: string): boolean {
    const helper = new JwtHelperService();
    return helper.isTokenExpired(token);
  }
}


