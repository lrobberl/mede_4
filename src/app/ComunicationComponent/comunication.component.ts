import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../Models/User';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {Message} from '../Models/Message';
import {UserService} from '../Services/pedibus.user.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client'; // TODO: verificare comunicazione in tempo reale se è abilitata qua
import {WebSocketService} from '../Services/websocket.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private websocketService: WebSocketService,
    private breakpointObserver: BreakpointObserver
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
              this.error = 'Operazione fallita';
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
          this.error = 'Operazione fallita';
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
          this.error = 'Operazione fallita';
      }
    );
  }

  ngOnDestroy(): void {
    this.websocketService.stompClient.unsubscribe();
  }
}
