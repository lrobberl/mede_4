import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../Models/User';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    if ( localStorage.getItem('currentUser') ) {
      const user: User = JSON.parse(localStorage.getItem('currentUser'));
      const token = user.token;

      if (token) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization',
            'Bearer ' + token)
        });

        return next.handle(cloned);
      } else {
        return next.handle(req);
      }
    } else {
        return next.handle(req);
    }
  }
}
