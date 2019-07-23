import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {MatSnackBar} from '@angular/material';
import {UserService} from './pedibus.user.service';


const REST_URL = 'http://localhost:8080/';



@Injectable()
export class WebSocketService {
  public stompClient: any;
  constructor(private snackBar: MatSnackBar,
              private userService: UserService) {
  }

  public connect() {
    const socket = new SockJS('http://localhost:8080/pedibus');
    this.stompClient = Stomp.over(socket);
    this.userService.getNumberNewMessages();
  }

  public disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
      }
    }

  showBanner() {
      this.snackBar.open('Nuova comunicazione', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['toolbar']
      });
  }
}

