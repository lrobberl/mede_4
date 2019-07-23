import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../Models/User';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {Message} from '../Models/Message';
import {UserService} from '../Services/pedibus.user.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {WebSocketService} from '../Services/websocket.service';

@Component({
  templateUrl: 'comunication.component.html',
  styleUrls: ['comunication.component.css']
})
export class ComunicationComponent implements OnInit, OnDestroy {
  currentUser: User;
  displayedColumns: string[] = ['data', 'messaggio'];
  messages: Message[];
  error: string;
  table = true;
  resultsLength: 10;
  private stompClient: any;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private websocketService: WebSocketService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    if (!this.currentUser) {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    // this.adminService.getAllUsers().subscribe( res => { this.users = res; });
    // this.users$ = this.adminService.getAllUsers();
    // console.log(this.users$);

    this.userService.getAllMessages().subscribe( messages => {
              this.messages = messages as Message[];
              this.table = true;
        }, error1 => {
              this.error = 'Operazione -getAllMessages- fallita';
              this.table = false;
    });
    this.userService.getNumberNewMessages();

    this.websocketService.disconnect();
    this.websocketService.connect();
    this.websocketService.stompClient.connect({}, () => { // Callback dopo aver effettuato correttamnete la connessione
      const username = JSON.parse(localStorage.getItem('currentUser')).username;
      console.log(username);

      this.websocketService.stompClient.subscribe('/user/' + username + '/queue/notifications', message => { // Callback nuovo messaggio
        const messageString = JSON.stringify(message);
        // console.log('Nuovo messaggio ricevuto ' + messageString);
        this.userService.getAllMessages().subscribe( messages => {
          this.messages = messages as Message[];
          this.table = true;
        }, error1 => {
          this.error = 'Operazione -getAllMessages- fallita';
          this.table = false;
        });
        this.userService.updateUnreadMessages(message.body);
        this.websocketService.showBanner();
      });
    });
  }

  segnaLetto(element: Message) {
    this.userService.segnaMessaggioLetto(element).subscribe(
      res => {
        element.letto = true;
        this.userService.getNumberNewMessages();
        }, error1 => {
          this.error = 'Operazione -segnaLetto- fallita';
      }
    );
  }

  ngOnDestroy(): void {
    this.websocketService.stompClient.unsubscribe();
  }
}
