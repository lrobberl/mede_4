import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';




const REST_URL = 'http://localhost:8080/';



@Injectable()
export class WebSocketService {
  public stompClient: any;
  constructor() {
  }

  public connect() {
    const socket = new SockJS('http://localhost:8080/pedibus');
    this.stompClient = Stomp.over(socket);

    console.log('Tentativo connessione WS...');
  }

  public disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
      }
    }
}

