import {Component, OnInit} from '@angular/core';
import {User} from '../Models/User';
import {AuthenticationService} from '../Services/authentication.service';
import {Role} from '../Models/Role';
import {Router} from '@angular/router';
import {Message} from '../Models/Message';
import {UserService} from '../Services/pedibus.user.service';

@Component({
      templateUrl: 'home.component.html',
      styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  error: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    // Se per caso il login non va a buon fine, rimando alla pagina di login prima di mostrare i contenuti della homepage
    /*if (!this.authenticationService.isLoggedIn()) {
      this.authenticationService.logout();
      this.router.navigate(['/login'], );
    }
     */
    if (!this.currentUser) {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.userService.getNumberNewMessages();
  }

  get isLogged() {
    return this.authenticationService.isLoggedIn();
  }
}
