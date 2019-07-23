import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import * as moment from './LoginComponent/pedibus.login.component';
import {HttpClient} from '@angular/common/http';
import {UserService} from './Services/pedibus.user.service';
import {AuthenticationService} from './Services/authentication.service';
import {User} from './Models/User';
import {WebSocketService} from './Services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public title: string;
  currentUser: User;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private websocketService: WebSocketService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.title = 'PEDIBUS - Home Page';
  }
}



