import {Component} from '@angular/core';
import {User} from '../Models/User';
import {AuthenticationService} from '../Services/authentication.service';
import {Role} from '../Models/Role';
import {Router} from '@angular/router';

@Component({
      templateUrl: 'home.component.html',
      styleUrls: ['home.component.css']
})
export class HomeComponent {
  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    // Se per caso il login non va a buon fine, rimando alla pagina di login prima di mostrare i contenuti della homepage
    if (!this.currentUser) {
      this.router.navigate(['/login'], );
    }
  }

  get isLogged() {
    return this.currentUser && (this.currentUser.role === Role.Admin || this.currentUser.role === Role.User);
  }
}
