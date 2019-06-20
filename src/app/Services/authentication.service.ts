import {Injectable} from '@angular/core';
import {Observable, of, BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {TokenData} from './pedibus.user.service';
import {User} from '../Models/User';

const REST_URL = 'http://localhost:8080/';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(mail: string, pass: string): Observable<User> {
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

    return this.http.post<User>(REST_URL + 'login', body, httpOptions).pipe(
      map(user => {
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }),
      catchError(err => {
        console.error(err);
        localStorage.setItem('user', 'Not logged');
        return of(null);
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

/*
  login(username: string, password: string) {
    return this.http.post<any>(`/users/authenticate`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }
 */
}


