import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../Models/User';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {Message} from '../Models/Message';
import {UserService} from '../Services/pedibus.user.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  templateUrl: 'comunication.component.html',
  styleUrls: ['comunication.component.css']
})
export class ComunicationComponent implements OnInit, OnDestroy {
  currentUser: User;
  displayedColumns: string[] = ['data', 'messaggio'];
  messages: Message[];
  /*
  messaggio: Message[] = [{
    id: '1234',
    utente: 'pippo',
    messaggio: 'Buongiorno, \n, volevo informale che l utente Pippo ha confermato la disponibilità per la corsa del 22/07/2019 per la ' +
      'linea Rossa. \n\n Grazie della visione',
    data: '30/06/2019',
    letto: false,
  }];
   */

  error: string;
  table = true;
  resultsLength: 10;
  private stompClient: any;

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

    this.WSconnect();
  }

  segnaLetto(element: Message) {
    this.userService.segnaMessaggioLetto(element).subscribe(
      res => {
        element.letto = true;
        }, error1 => {
          this.error = 'Operazione -segnaLetto- fallita';
      }
    );
  }

  WSconnect() {
    const socket = new SockJS('http://localhost:8080/pedibus');
    this.stompClient = Stomp.over(socket);

    const questo = this;
    this.stompClient.connect({}, frame => {
      questo.stompClient.subscribe('/topic/comunicazioni', handler);

      function handler() {
        questo.userService.getAllMessages().subscribe( messages => {
          this.messages = messages as Message[];
          this.table = true;
        }, error1 => {
          this.error = 'Operazione -getAllMessages- fallita';
          this.table = false;
        });
      }
    });

    this.stompClient.heartbeat.outgoing = 20000; // client will send heartbeats every 20000ms
    this.stompClient.heartbeat.incoming = 0;     // client does not want to receive heartbeats from the server
  }

  WSClose() {
      if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  ngOnDestroy(): void {
    this.WSClose();
  }
}
