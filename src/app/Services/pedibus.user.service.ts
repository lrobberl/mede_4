import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {Message} from '../Models/Message';
import {BambinoRegistration} from '../Models/BambinoRegistration';
import {RegisterForm} from '../Models/RegisterForm';
import {Bambino} from '../Models/Bambino';
import {numbers} from '@material/list/constants';

const REST_URL = 'http://localhost:8080/';

export interface TokenData {
  id_token: string;
}

export interface CheckEmailPresent {
  presente: string;
}

@Injectable()
export class UserService {
  user: RegisterForm;
  userLogged: string;
  newCommunicationsSource = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {
  }

  // Todo: verificare cosa ritorna il Server dopo aver effettuato la registrazione
  register(firstName: string, lastName: string, mail: string, password: string, password2: string,
           fermataDef: string, figliArray: BambinoRegistration[], uuid: string): Observable<RegisterForm> {
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
      pass2: password2,
      fermataDefault: fermataDef,
      figli: figliArray
  };

    const body = JSON.stringify(this.user);

    return this.http.post<RegisterForm>(REST_URL + 'confirm/' + uuid, body, httpOptions);
  }

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

  getAllMessages(): Observable<Message []> {
    console.log('UserService.getAllMessages');

    return this.http.get<Message []>(REST_URL + 'comunicazioni');
  }
  // Get from the server the number of incoming messages for a certain USER specified in the URL path
  getNumberNewMessages() {
    console.log('UserService.getNumberNewMessages');
    // this.newCommunicationsSource.next(4);

    return this.http.get<number>(REST_URL + 'unread-comunicazioni').subscribe( res => {
      this.newCommunicationsSource.next(res);
    });
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

  getFigli(): Observable<Bambino[]> {
    console.log('UserService.getFigli');

    return this.http.get<Bambino []>(REST_URL + 'figli');
  }

  updateUnreadMessages(message: number) {
    this.newCommunicationsSource.next(message);
  }
}
