import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthenticationService} from '../../Services/authentication.service';
import {Router} from '@angular/router';
import {User} from '../../Models/User';
import {Role} from '../../Models/Role';
import {UserService} from '../../Services/pedibus.user.service';
import {WebSocketService} from '../../Services/websocket.service';
import {Message} from '../../Models/Message';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  currentUser: User;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  isClicked = false;

  title = 'PIEDIBUS';
  newMessages: number;
  error: string;

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    // this.userService.getNumberNewMessages();
    this.userService.newCommunicationsSource.subscribe( x => {
      this.newMessages = x;
    });
  }

  get grClick() {
    return this.isClicked = !this.isClicked;
  }

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


  goTo(page: string) {
    if (page === 'comunicazioni') {
      this.router.navigate(['comunications']);
    }
  }
}
