import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../Models/User';
import {AuthenticationService} from '../Services/authentication.service';
import {Role} from '../Models/Role';
import {Router} from '@angular/router';
import {Message} from '../Models/Message';
import {UserService} from '../Services/pedibus.user.service';
import {WebSocketService} from '../Services/websocket.service';
import {MatSnackBar} from '@angular/material';
import {Bambino} from '../Models/Bambino';

@Component({
      templateUrl: 'home.component.html',
      styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  error: string;
  figli: Bambino[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private websocketService: WebSocketService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    if (!this.currentUser) {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.userService.getNumberNewMessages();
    this.websocketService.disconnect();
    this.websocketService.connect();
    this.websocketService.stompClient.heartbeat.outgoing = 20000; // client will send heartbeats every 20000ms
    this.websocketService.stompClient.heartbeat.incoming = 0;     // client does not want to receive heartbeats from the server

    this.websocketService.stompClient.connect({}, () => { // Callback dopo aver effettuato correttamnete la connessione
      const username = JSON.parse(localStorage.getItem('currentUser')).username;

      this.websocketService.stompClient.subscribe('/user/' + username + '/queue/notifications', message => { // Callback nuovo messaggio
        const messageString = JSON.stringify(message);
        this.userService.updateUnreadMessages(message.body);
        this.websocketService.showBanner();
      });
    });

    this.userService.getFigli().subscribe(
      x => {
        this.figli = x;
        this.error = undefined;
      },
      error1 => {
        this.error = 'Operazione Fallita';
      }
    );
  }

  get isLogged() {
    return this.authenticationService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.websocketService.stompClient.unsubscribe();
  }
}
