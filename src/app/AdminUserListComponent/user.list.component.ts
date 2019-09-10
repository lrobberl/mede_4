import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';
import {AdminService} from '../Services/admin.service';
import {Observable} from 'rxjs';
import {User} from '../Models/User';
import {WebSocketService} from '../Services/websocket.service';

@Component({
  selector: 'app-pedibus-admin-user-list',
  templateUrl: './user.list.component.html',
  styleUrls: ['./user.list.component.css']
})

export class UserListComponent implements OnInit, OnDestroy {
  users: User[];
  // users$: Observable<User[]>;
  displayedColumns: string[] = ['id', 'username', 'role', 'status'];
  error = '';



  constructor(private router: Router,
              private adminService: AdminService,
              private authenticationService: AuthenticationService,
              private websocketService: WebSocketService,
              private userService: UserService) {
    if (!this.authenticationService.isLoggedIn()) {
      this.authenticationService.logout();
      this.router.navigate(['/login'], );
    }
  }

  ngOnInit(): void {
    // this.adminService.getAllUsers().subscribe( res => { this.users = res; });
    // this.users$ = this.adminService.getAllUsers();
    this.adminService.getAllUsers().subscribe(
      users => {
        this.users = users as User[];
        this.error = '';
    }, error1 => {
        this.error = 'Operazione fallita';
      });
    // console.log(this.users$);
    this.websocketService.disconnect();
    this.websocketService.connect();
    this.websocketService.stompClient.heartbeat.outgoing = 20000; // client will send heartbeats every 20000ms
    this.websocketService.stompClient.heartbeat.incoming = 0;     // client does not want to receive heartbeats from the server

    this.websocketService.stompClient.connect({}, () => { // Callback dopo aver effettuato correttamnete la connessione
      const username = JSON.parse(localStorage.getItem('currentUser')).username;
      // console.log(username);

      this.websocketService.stompClient.subscribe('/user/' + username + '/queue/notifications', message => { // Callback nuovo messaggio
        const messageString = JSON.stringify(message);
        // console.log('Nuovo messaggio ricevuto ' + messageString);
        this.userService.updateUnreadMessages(message.body);
        this.websocketService.showBanner();
        // this.userService.getNumberNewMessages();
      });
    });
  }

  ngOnDestroy(): void {
    this.websocketService.stompClient.unsubscribe();
  }
}
