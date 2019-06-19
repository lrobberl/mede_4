import {Component} from '@angular/core';
import {User} from '../Models/User';
import {UserService} from '../Services/pedibus.user.service';
import {AuthenticationService} from '../Services/authentication.service';
import {Role} from '../Models/Role';

@Component({
      templateUrl: 'home.component.html',
      styleUrls: ['home.component.css']
})
export class HomeComponent {
  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
}
