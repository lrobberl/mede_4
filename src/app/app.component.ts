import {Component, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import * as moment from './LoginComponent/pedibus.login.component';
import {HttpClient} from '@angular/common/http';
import {RegisterForm, UserService} from './Services/pedibus.user.service';
import {AuthenticationService} from './Services/authentication.service';
import {User} from './Models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public title: string;
  currentUser: User;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.title = 'PEDIBUS - Home Page';
    if (localStorage.getItem('user') === null) {
      localStorage.setItem('user', 'Not logged');
    }
  }

  /*
  logout() {
    this.userService.logout();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  getUserLoggedIn() {
    return localStorage.getItem('user');
  }
  */
}



