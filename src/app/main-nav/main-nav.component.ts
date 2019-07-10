import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {User} from '../Models/User';
import {Role} from '../Models/Role';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  currentUser: User;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  title = 'PIEDIBUS';

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  /*
  get isAdmin() {
    return this.currentUser && this.currentUser.listaRuoli.includes(Role.Accompagnatore);
  }
   */

  get isSystemAdmin() {
    return this.currentUser && this.currentUser.listaRuoli.includes(Role.SystemAdmin);
  }

  get isSystemAdminOrAccompagnatore() {
    return this.currentUser && (this.currentUser.listaRuoli.includes(Role.SystemAdmin)
      || this.currentUser.listaRuoli.includes(Role.Accompagnatore));
  }

  get isLogged() {
    return this.currentUser && (this.currentUser.listaRuoli.includes(Role.Accompagnatore) || this.currentUser.listaRuoli.includes(Role.User)
      || this.currentUser.listaRuoli.includes(Role.SystemAdmin));
  }

  logout() {
    this.authenticationService.logout();
  }
}
