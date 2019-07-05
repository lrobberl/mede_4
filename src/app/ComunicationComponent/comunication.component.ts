import {Component, OnInit} from '@angular/core';
import {User} from '../Models/User';
import {AuthenticationService} from '../Services/authentication.service';
import {Role} from '../Models/Role';
import {Router} from '@angular/router';
import {Message} from '../Models/Message';
import {UserService} from '../Services/pedibus.user.service';

@Component({
  templateUrl: 'comunication.component.html',
  styleUrls: ['comunication.component.css']
})
export class ComunicationComponent implements OnInit {
  currentUser: User;
  displayedColumns: string[] = ['data', 'messaggio', 'mittente'];
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
}
